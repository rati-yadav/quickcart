from decimal import Decimal

from django.contrib.auth.models import User
from django.db.models import Avg, Count
from django.utils.text import slugify
from rest_framework import serializers

from .models import Address, Order, OrderItem, Product, Review, WishlistItem


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=1, read_only=True, default=0)
    review_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'price',
            'image_url',
            'category',
            'stock',
            'average_rating',
            'review_count',
        )


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'price',
            'image_url',
            'category',
            'stock',
        )

    def _ensure_slug(self, validated_data):
        name = validated_data.get('name', '')
        slug = validated_data.get('slug') or slugify(name)
        base = slug
        n = 1
        while Product.objects.filter(slug=slug).exclude(pk=self.instance.pk if self.instance else None).exists():
            slug = f'{base}-{n}'
            n += 1
        validated_data['slug'] = slug
        return validated_data

    def create(self, validated_data):
        validated_data = self._ensure_slug(validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._ensure_slug(validated_data)
        return super().update(instance, validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'username', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'created_at', 'username')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('rating', 'comment')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def create(self, validated_data):
        product = self.context['product']
        user = self.context['request'].user
        review, _ = Review.objects.update_or_create(
            product=product,
            user=user,
            defaults=validated_data,
        )
        return review


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WishlistItem
        fields = ('id', 'product', 'product_id', 'created_at')
        read_only_fields = ('id', 'created_at', 'product')


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            'id',
            'full_name',
            'phone',
            'line1',
            'line2',
            'city',
            'state',
            'pincode',
            'is_default',
            'created_at',
        )
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        if validated_data.get('is_default') or not Address.objects.filter(user=user).exists():
            Address.objects.filter(user=user).update(is_default=False)
            validated_data['is_default'] = True
        return Address.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        if validated_data.get('is_default'):
            Address.objects.filter(user=instance.user).exclude(pk=instance.pk).update(is_default=False)
        return super().update(instance, validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class OrderItemReadSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_image = serializers.URLField(source='product.image_url', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('product_id', 'product_name', 'product_image', 'quantity', 'unit_price')


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)
    status_label = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = (
            'id',
            'created_at',
            'status',
            'status_label',
            'payment_method',
            'payment_id',
            'tracking_id',
            'shipping_address',
            'total_amount',
            'items',
        )


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)


PAYMENT_METHODS = ('upi', 'card', 'netbanking', 'cod', 'wallet', 'razorpay')


class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)
    payment_method = serializers.ChoiceField(choices=PAYMENT_METHODS, default='upi')
    address_id = serializers.IntegerField(required=False, allow_null=True)
    razorpay_order_id = serializers.CharField(required=False, allow_blank=True)
    razorpay_payment_id = serializers.CharField(required=False, allow_blank=True)
    razorpay_signature = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('At least one item is required.')
        return value

    def create(self, validated_data):
        from .razorpay_service import verify_payment

        request = self.context['request']
        user = request.user
        items_data = validated_data['items']

        address_text = ''
        address_id = validated_data.get('address_id')
        if address_id:
            try:
                addr = Address.objects.get(pk=address_id, user=user)
                address_text = (
                    f'{addr.full_name}, {addr.phone}\n{addr.line1}, {addr.line2}\n'
                    f'{addr.city}, {addr.state} - {addr.pincode}'
                )
            except Address.DoesNotExist as exc:
                raise serializers.ValidationError({'address_id': 'Invalid address.'}) from exc

        total = Decimal('0')
        order_items = []
        for row in items_data:
            try:
                product = Product.objects.get(pk=row['product_id'])
            except Product.DoesNotExist as exc:
                raise serializers.ValidationError({'items': 'One or more products are invalid.'}) from exc
            if product.stock < row['quantity']:
                raise serializers.ValidationError(
                    {'items': f'Only {product.stock} left for {product.name}.'}
                )
            line_total = product.price * row['quantity']
            total += line_total
            order_items.append((product, row['quantity']))

        rp_order_id = validated_data.get('razorpay_order_id', '')
        rp_payment_id = validated_data.get('razorpay_payment_id', '')
        rp_signature = validated_data.get('razorpay_signature', '')
        payment_method = validated_data.get('payment_method', 'upi')

        if rp_payment_id:
            try:
                verify_payment(rp_order_id, rp_payment_id, rp_signature)
            except Exception as exc:
                raise serializers.ValidationError({'payment': 'Payment verification failed.'}) from exc
            payment_method = 'razorpay'
            status = Order.STATUS_CONFIRMED
        else:
            status = Order.STATUS_PLACED

        order = Order.objects.create(
            user=user,
            payment_method=payment_method,
            payment_id=rp_payment_id or '',
            razorpay_order_id=rp_order_id or '',
            shipping_address=address_text,
            total_amount=total,
            status=status,
        )
        for product, qty in order_items:
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                unit_price=product.price,
            )
            product.stock = max(0, product.stock - qty)
            product.save(update_fields=['stock'])
        return order


class RazorpayCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('1'))
