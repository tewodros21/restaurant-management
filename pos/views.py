from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Order, OrderItem, Table
from .serializers import ProductSerializer, OrderSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """
        Close an open order and process payment
        """
        order = self.get_object()

        # 1. Order must be open
        if order.status != "open":
            return Response(
                {"error": "Only open orders can be closed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Payment method required
        payment_method = request.data.get("payment_method")
        if not payment_method:
            return Response(
                {"error": "Payment method is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Update order
        order.payment_method = payment_method
        order.status = "paid"
        order.save()

        # 4. Free the table
        if order.table:
            order.table.is_occupied = False
            order.table.save()

        return Response(
            {
                "message": "Order closed successfully.",
                "order_id": order.id,
                "total_amount": order.get_total_amount(),
                "payment_method": order.payment_method
            },
            status=status.HTTP_200_OK
        )
