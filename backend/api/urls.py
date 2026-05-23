from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')

admin_router = DefaultRouter()
admin_router.register(r'products', views.AdminProductViewSet, basename='admin-product')

urlpatterns = [
    path('health/', views.health, name='health'),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('orders/', views.OrderListCreateView.as_view(), name='orders'),
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    path('wishlist/<int:product_id>/', views.wishlist_remove, name='wishlist-remove'),
    path('addresses/', views.AddressListCreateView.as_view(), name='addresses'),
    path('addresses/<int:pk>/', views.AddressDetailView.as_view(), name='address-detail'),
    path('payments/razorpay/create/', views.create_razorpay_order, name='razorpay-create'),
    path('payments/razorpay/config/', views.razorpay_config, name='razorpay-config'),
    path('admin/stats/', views.admin_stats, name='admin-stats'),
    path('admin/', include(admin_router.urls)),
    path('', include(router.urls)),
]
