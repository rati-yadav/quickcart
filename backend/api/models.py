from decimal import Decimal

from django.conf import settings
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500)
    category = models.CharField(max_length=100, blank=True)
    stock = models.PositiveIntegerField(default=50)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = [['product', 'user']]

    def __str__(self):
        return f'Review {self.rating}★ on {self.product_id}'


class WishlistItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='wishlist', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['user', 'product']]
        ordering = ['-created_at']


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='addresses', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=12)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_default', '-created_at']
        verbose_name_plural = 'addresses'

    def __str__(self):
        return f'{self.full_name}, {self.city}'


class Order(models.Model):
    STATUS_PLACED = 'Placed'
    STATUS_CONFIRMED = 'Confirmed'
    STATUS_PACKED = 'Packed'
    STATUS_SHIPPED = 'Shipped'
    STATUS_OUT_FOR_DELIVERY = 'OutForDelivery'
    STATUS_DELIVERED = 'Delivered'

    STATUS_CHOICES = [
        (STATUS_PLACED, 'Placed'),
        (STATUS_CONFIRMED, 'Confirmed'),
        (STATUS_PACKED, 'Packed'),
        (STATUS_SHIPPED, 'Shipped'),
        (STATUS_OUT_FOR_DELIVERY, 'Out for delivery'),
        (STATUS_DELIVERED, 'Delivered'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_PLACED)
    payment_method = models.CharField(max_length=32, default='upi')
    payment_id = models.CharField(max_length=128, blank=True)
    razorpay_order_id = models.CharField(max_length=128, blank=True)
    tracking_id = models.CharField(max_length=64, blank=True)
    shipping_address = models.TextField(blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order {self.pk} ({self.user_id})'

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and not self.tracking_id:
            self.tracking_id = f'AMZ{self.pk:08d}'
            super().save(update_fields=['tracking_id'])


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def line_total(self) -> Decimal:
        return self.unit_price * self.quantity
