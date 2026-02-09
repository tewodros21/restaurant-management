import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:8000/api";

export default function CartPanel({
  order,
  items = [],
  loading,
  onQtyChange,
  onRemove,
  onOrderPaid,
}) {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paying, setPaying] = useState(false);

  if (loading) {
    return <p className="text-gray-400 text-center mt-10">Loading order...</p>;
  }

  if (!order) {
    return <p className="text-gray-400 text-center mt-10">Select a table to start</p>;
  }

  const isLocked = order.status !== "open";

  const total = items.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0
  );

  /* ---------- PAYMENT ---------- */
    const handlePayment = async () => {
      setPaying(true);
      try {
        await axios.post(`${API}/orders/${order.id}/close/`, {
          payment_method: paymentMethod,
        });

        toast.success("Payment completed"); // ✅ ADD THIS

        setShowPayment(false);
        await onOrderPaid();
      } catch (err) {
        console.error(err);
        toast.error("Payment failed");
      } finally {
        setPaying(false);
      }
    };


  return (
    <>
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
        <p className="text-xs text-gray-500 mb-4">Status: {order.status}</p>

        <div className="flex-1 overflow-y-auto space-y-3">
          {items.length === 0 && (
            <p className="text-gray-400 text-center mt-10">No items yet</p>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-gray-500">
                  ${Number(item.product_price).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={isLocked || item.quantity <= 1}
                  onClick={() => onQtyChange(item.id, item.quantity - 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  −
                </button>

                <span className="w-6 text-center">{item.quantity}</span>

                <button
                  disabled={isLocked}
                  onClick={() => onQtyChange(item.id, item.quantity + 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>

                <button
                  disabled={isLocked}
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 font-bold ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            disabled={items.length === 0 || isLocked}
            onClick={() => setShowPayment(true)}
            className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg"
          >
            Bill & Payment
          </button>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Payment</h2>

            <p className="mb-4 font-semibold">Total: ${total.toFixed(2)}</p>

            {["cash", "bank", "digital"].map((m) => (
              <label key={m} className="flex justify-between mb-2">
                <span className="capitalize">{m}</span>
                <input
                  type="radio"
                  checked={paymentMethod === m}
                  onChange={() => setPaymentMethod(m)}
                />
              </label>
            ))}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 border rounded py-2"
              >
                Cancel
              </button>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="flex-1 bg-green-600 text-white rounded py-2"
              >
                {paying ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
