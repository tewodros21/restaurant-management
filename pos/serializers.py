from rest_framework import serializers
from .models import Product, Order, OrderItem, Table

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'is_active']

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'number', 'is_occupied']

class OrderItemSerializer(serializers.ModelSerializer):
    
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)   # list of order items
    total_amount = serializers.SerializerMethodField()       # total of order
    table_number = serializers.SerializerMethodField()       # show table number in response

    class Meta:
        model = Order
        fields = [
            'id',
            'table',          
            'table_number',  
            'status',
            'payment_method',
            'created_at',
            'items',
            'total_amount',
        ]

    def get_total_amount(self, obj):
        return obj.get_total_amount()

    def get_table_number(self, obj):
        if obj.table:
            return obj.table.number
        return None
