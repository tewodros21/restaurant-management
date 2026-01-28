from django.contrib import admin
from .models import Product, Order, OrderItem,Table

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('id', 'table', 'status', 'payment_method', 'created_at', 'get_total_amount')

admin.site.register(Product)
admin.site.register(Table)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)

