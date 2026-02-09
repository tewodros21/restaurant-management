from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

from .models import Product, Order, OrderItem, Table
from .serializers import (
    ProductSerializer,
    OrderSerializer,
    TableSerializer,
    OrderItemSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()

        in_use = OrderItem.objects.filter(
            product=product,
            order__status__in=["open", "paid"]
        ).exists()

        if in_use:
            return Response(
                {"error": "Cannot delete product used in active or paid orders."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return super().destroy(request, *args, **kwargs)



class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=False, methods=["get"], url_path="by-table/(?P<table_id>[^/.]+)")
    def by_table(self, request, table_id=None):
        table = Table.objects.get(id=table_id)

        order = Order.objects.filter(table=table, status="open").first()

        if order and order.items.count() == 0:
            order.status = "cancelled"
            order.save()
            table.is_occupied = False
            table.save()
            order = None

        if order:
            return Response(self.get_serializer(order).data)

        order = Order.objects.create(table=table, status="open")
        table.is_occupied = True
        table.save()

        return Response(self.get_serializer(order).data, status=201)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()

        if order.status == "paid":
            return Response({"error": "Paid orders cannot be cancelled"}, status=400)

        order.status = "cancelled"
        order.save()

        if order.table:
            order.table.is_occupied = False
            order.table.save()

        return Response({"message": "Order cancelled"})

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        order = self.get_object()

        if order.status != "open":
            return Response({"error": "Only open orders"}, status=400)

        payment_method = request.data.get("payment_method")
        if not payment_method:
            return Response({"error": "Payment method required"}, status=400)

        order.payment_method = payment_method
        order.status = "paid"
        order.save()

        if order.table:
            order.table.is_occupied = False
            order.table.save()

        return Response({
            "message": "Order closed",
            "total": order.get_total_amount()
        })


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    # ➕ ADD TO CART (MERGE ITEMS)
    def create(self, request, *args, **kwargs):
        order_id = request.data.get("order")
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        if not order_id or not product_id:
            raise ValidationError("Order and product are required.")

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise ValidationError("Order not found.")

        if order.status != "open":
            raise ValidationError("Cannot modify closed order.")

        item, created = OrderItem.objects.get_or_create(
            order=order,
            product_id=product_id,
            defaults={"quantity": quantity},
        )

        if not created:
            item.quantity += quantity
            item.save()

        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # 🔄 UPDATE QUANTITY (+ / −)
    def partial_update(self, request, *args, **kwargs):
        item = self.get_object()

        if item.order.status != "open":
            raise ValidationError("Cannot modify closed order.")

        quantity = request.data.get("quantity")
        if quantity is None:
            raise ValidationError("Quantity is required.")

        quantity = int(quantity)

        if quantity <= 0:
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        item.quantity = quantity
        item.save()

        serializer = self.get_serializer(item)
        return Response(serializer.data)

    # ❌ REMOVE ITEM (×)
    def destroy(self, request, *args, **kwargs):
        item = self.get_object()

        if item.order.status != "open":
            raise ValidationError("Cannot modify closed order.")

        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

