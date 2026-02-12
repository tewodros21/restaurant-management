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


# =========================
# PRODUCTS
# =========================
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


# =========================
# TABLES
# =========================
class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer


# =========================
# ORDERS
# =========================
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    # 🔁 GET or CREATE OPEN ORDER BY TABLE
    @action(detail=False, methods=["get"], url_path="by-table/(?P<table_id>[^/.]+)")
    def by_table(self, request, table_id=None):
        table = Table.objects.get(id=table_id)

        # 🔥 Return latest ACTIVE order (not paid/cancelled)
        order = (
            Order.objects
            .filter(table=table)
            .exclude(status__in=["paid", "cancelled"])
            .order_by("-created_at")
            .first()
        )

        if order:
            return Response(self.get_serializer(order).data)

        # ✅ Create new order ONLY if none exists
        order = Order.objects.create(table=table, status="open")
        table.is_occupied = True
        table.save()

        return Response(self.get_serializer(order).data, status=201)


    # ❌ CANCEL ORDER
    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()

        if order.status == "paid":
            return Response(
                {"error": "Paid orders cannot be cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "cancelled"
        order.save()

        if order.table:
            order.table.is_occupied = False
            order.table.save()

        return Response({"message": "Order cancelled"})

    # 💰 CLOSE ORDER (PAYMENT)
    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        order = self.get_object()

        if order.status not in ["open", "served"]:
            return Response(
                {"error": "Only open or served orders can be closed"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_method = request.data.get("payment_method")
        if not payment_method:
            return Response(
                {"error": "Payment method required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.payment_method = payment_method
        order.status = "paid"
        order.save()

        if order.table:
            order.table.is_occupied = False
            order.table.save()

        return Response({
            "message": "Order closed",
            "total": order.get_total_amount(),
        })


    # 🧾 SEND TO KITCHEN
    @action(detail=True, methods=["post"])
    def send_to_kitchen(self, request, pk=None):
        order = self.get_object()

        if order.status != "open":
            return Response(
                {"error": "Only open orders can be sent to kitchen"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.items.count() == 0:
            return Response(
                {"error": "Cannot send empty order"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "preparing"
        order.save()

        return Response({"message": "Order sent to kitchen"})

    # 🍽️ MARK AS SERVED (Kitchen)
    @action(detail=True, methods=["post"])
    def mark_served(self, request, pk=None):
        order = self.get_object()

        if order.status != "preparing":
            return Response(
                {"error": "Only preparing orders can be served"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "served"
        order.save()

        return Response({"message": "Order served"})

    


# =========================
# ORDER ITEMS
# =========================
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    # ➕ ADD TO CART
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

        # ✅ OCCUPY TABLE ON FIRST ITEM
        if order.table and not order.table.is_occupied:
            order.table.is_occupied = True
            order.table.save()

        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # 🔄 UPDATE QUANTITY
    def partial_update(self, request, *args, **kwargs):
        item = self.get_object()

        if item.order.status != "open":
            raise ValidationError("Cannot modify closed order.")

        quantity = request.data.get("quantity")
        if quantity is None:
            raise ValidationError("Quantity is required.")

        quantity = int(quantity)

        if quantity <= 0:
            return self.destroy(request, *args, **kwargs)

        item.quantity = quantity
        item.save()

        serializer = self.get_serializer(item)
        return Response(serializer.data)

    # ❌ REMOVE ITEM
    def destroy(self, request, *args, **kwargs):
        item = self.get_object()
        order = item.order

        if order.status != "open":
            raise ValidationError("Cannot modify closed order.")

        item.delete()

        # 🔐 AUTO-CANCEL IF LAST ITEM REMOVED
        if order.items.count() == 0:
            order.status = "cancelled"
            order.save()

            if order.table:
                order.table.is_occupied = False
                order.table.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
