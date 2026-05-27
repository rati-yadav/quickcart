from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from .models import Address, Order, Product, Review, WishlistItem
from .razorpay_service import create_payment_order, is_razorpay_configured
from .serializers import (
    AddressSerializer,
    OrderCreateSerializer,
    OrderReadSerializer,
    ProductSerializer,
    ProductWriteSerializer,
    RazorpayCreateSerializer,
    RegisterSerializer,
    ReviewCreateSerializer,
    ReviewSerializer,
    WishlistSerializer,
)


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'app': 'quickcart'})


@api_view(['GET'])
def api_root(request):
    return Response(
        {
            'message': 'QuickCart API is running.',
            'frontend': 'Open http://localhost:5173 in your browser (run: cd frontend && npm run dev)',
            'endpoints': {
                'health': '/api/health/',
                'products': '/api/products/',
                'admin': '/admin/',
            },
        }
    )


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        qs = Product.objects.annotate(
            average_rating=Avg('reviews__rating'),
            review_count=Count('reviews'),
        )
        q = self.request.query_params.get('q', '').strip()
        category = self.request.query_params.get('category', '').strip()
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        sort = self.request.query_params.get('sort', '').strip()

        if q:
            qs = qs.filter(
                Q(name__icontains=q)
                | Q(description__icontains=q)
                | Q(category__icontains=q)
                | Q(slug__icontains=q)
            )
        if category and category.lower() != 'all':
            qs = qs.filter(category__icontains=category)
        if min_price:
            try:
                qs = qs.filter(price__gte=min_price)
            except ValueError:
                pass
        if max_price:
            try:
                qs = qs.filter(price__lte=max_price)
            except ValueError:
                pass

        if sort == 'price_asc':
            qs = qs.order_by('price')
        elif sort == 'price_desc':
            qs = qs.order_by('-price')
        elif sort == 'rating':
            qs = qs.order_by('-average_rating', '-review_count')
        else:
            qs = qs.order_by('id')

        return qs

    @action(detail=True, methods=['get', 'post'], permission_classes=[AllowAny])
    def reviews(self, request, slug=None):
        product = self.get_object()
        if request.method == 'GET':
            reviews = Review.objects.filter(product=product).select_related('user')
            return Response(ReviewSerializer(reviews, many=True).data)
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=401)
        serializer = ReviewCreateSerializer(
            data=request.data,
            context={'request': request, 'product': product},
        )
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        return Response(ReviewSerializer(review).data, status=201)


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductWriteSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_stats(request):
    return Response(
        {
            'products': Product.objects.count(),
            'orders': Order.objects.count(),
            'users': User.objects.count(),
        }
    )


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderReadSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderReadSerializer(order).data, status=201)


class WishlistView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related('product')

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'detail': 'product_id required.'}, status=400)
        product = get_object_or_404(Product, pk=product_id)
        item, created = WishlistItem.objects.get_or_create(user=request.user, product=product)
        return Response(
            WishlistSerializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_remove(request, product_id):
    deleted, _ = WishlistItem.objects.filter(user=request.user, product_id=product_id).delete()
    if not deleted:
        return Response({'detail': 'Not in wishlist.'}, status=404)
    return Response(status=204)


class AddressListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    serializer = RazorpayCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    receipt = f'user_{request.user.id}'
    data = create_payment_order(serializer.validated_data['amount'], receipt)
    data['razorpay_configured'] = is_razorpay_configured()
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def razorpay_config(request):
    return Response({'configured': is_razorpay_configured()})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    if User.objects.filter(username=serializer.validated_data['username']).exists():
        return Response({'detail': 'Username already taken.'}, status=400)
    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    return Response(_auth_payload(user, token))


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'Username and password required.'}, status=400)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'detail': 'Invalid credentials.'}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response(_auth_payload(user, token))


def _auth_payload(user, token):
    return {
        'token': token.key,
        'user_id': user.id,
        'username': user.username,
        'is_staff': user.is_staff,
    }
