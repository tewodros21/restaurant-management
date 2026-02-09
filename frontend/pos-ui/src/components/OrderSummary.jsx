import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:8000/api";

export default function OrderSummary({
  order,
  items,
  onQtyChange,
  onRemove,
  onOrderClosed,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const isLocked = order?.status !== "open";

  const total = items.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0
  );

  /* ---------------- CLOSE ORDER ---------------- */
  const closeOrder = async () => {
    if (!order || items.length === 0) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API}/orders/${order.id}/close/`, {
        payment_method: paymentMethod,
      });

      toast.success(
        `Order paid • Total $${Number(res.data.total_amount).toFixed(2)}`
      );

      onOrderClosed();
    } catch (err) {
      console.error(err);
      toast.error("Failed to close order");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CANCEL ORDER ---------------- */
  const cancelOrder = async () => {
    if (!order) return;

    if (!window.confirm("Cancel this order?")) return;

    setLoading(true);
    try {
      await axios.post(`${API}/orders/${order.id}/cancel/`);

      toast.success("Order cancelled");
      onOrderClosed();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STATUS BADGE ---------------- */
  const StatusBadge = () => {
    if (!order) return null;

    const base =
      "px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide";

    if (order.status === "open")
      return <span className={`${base} bg-green-100 text-green-700`}>Open</span>;

    if (order.status === "paid")
      return <span className={`${base} bg-blue-100 text-blue-700`}>Paid</span>;

    return (
      <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>
    );
  };

  return (
    <div
      className={`col-span-4 bg-white p-4 rounded-lg shadow flex flex-col transition
        ${isLocked ? "opacity-60" : ""}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order</h2>
        <StatusBadge />
      </div>

      {!order && (
        <p className="text-gray-400 text-center mt-10">
          Select a table to start
        </p>
      )}

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center mb-3 border-b pb-2"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {item.product_name}
              </p>
              <p className="text-gray-500 text-sm">
                ${Number(item.product_price).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={item.quantity <= 1 || isLocked}
                onClick={() => onQtyChange(item.id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40"
              >
                -
              </button>

              <span className="min-w-[20px] text-center">
                {item.quantity}
              </span>

              <button
                disabled={isLocked}
                onClick={() => onQtyChange(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40"
              >
                +
              </button>

              <button
                disabled={isLocked}
                onClick={() => onRemove(item.id)}
                className="text-red-500 font-bold ml-2 hover:text-red-700 disabled:opacity-40"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {order && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between text-xl font-bold mb-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <select
            value={paymentMethod}
            disabled={isLocked}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded mb-3 disabled:opacity-50"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="digital">Digital</option>
          </select>

          {/* Cancel */}
          {order.status === "open" && (
            <button
              onClick={cancelOrder}
              disabled={loading}
              className="w-full mb-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              Cancel Order
            </button>
          )}

          {/* Close */}
          <button
            onClick={closeOrder}
            disabled={loading || items.length === 0 || isLocked}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
          >
            {order.status === "cancelled"
              ? "Order Cancelled"
              : order.status === "paid"
              ? "Order Paid"
              : loading
              ? "Closing..."
              : "Close Order"}
          </button>
        </div>
      )}
    </div>
  );
}
