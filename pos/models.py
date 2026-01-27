from django.db import models

# products in restaurant
class Product(models.Model):
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

# orders made by customers
class Order(models.Model):
    PAYMENT_METHODS = [
        ("cash", "Cash"),
        ("bank", "Bank"),
        ("digital", "Digital"),
    ]

    STATUS_CHOICES = [
        ("open", "Open"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    table_number = models.PositiveIntegerField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"

# items in each order
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def get_total_price(self):
        return self.product.price * self.quantity
