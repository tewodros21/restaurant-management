from rest_framework import serializers
from .models import Product, Order, OrderItem, Table


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_price = serializers.ReadOnlyField(source="product.price")

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "order",
            "product",
            "product_name",
            "product_price",
            "quantity",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "table",
            "status",
            "payment_method",
            "created_at",
            "items",
            "total_amount",
        ]

    def get_total_amount(self, obj):
        return obj.get_total_amount()
