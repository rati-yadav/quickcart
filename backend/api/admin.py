from django.contrib import admin

from .models import Address, Order, OrderItem, Product, Review, WishlistItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'price', 'category')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'slug')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'created_at')


@admin.register(WishlistItem)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'city', 'is_default')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'status', 'tracking_id', 'payment_method')
    list_filter = ('status', 'payment_method')
    inlines = [OrderItemInline]
