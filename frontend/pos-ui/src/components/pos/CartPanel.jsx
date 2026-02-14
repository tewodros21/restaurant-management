import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

//const API = "http://127.0.0.1:8000/api";
const API = "https://restaurant-management-2lef.onrender.com/api";


export default function CartPanel({
  order,
  items = [],
  loading,
  onQtyChange,
  onRemove,
  onOrderPaid,
  onCancelEmpty,
  onSendToKitchen,
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

  //const isLocked = order.status !== "open";
  const isLocked = ["paid", "cancelled"].includes(order.status);


  const total = items.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0
  );

  /* ---------- PAYMENT ---------- */
const handlePayment = async () => {
  setPaying(true);
  try {
    const res = await axios.post(
      `${API}/orders/${order.id}/close/`,
      { payment_method: paymentMethod }
    );

    toast.success("Payment completed");

    setShowPayment(false);

    // ✅ PASS CLOSED ORDER DATA
    onOrderPaid({
      ...order,
      status: "paid",
      payment_method: paymentMethod,
      total: res.data.total,
      items: items, // 🔑 IMPORTANT
    });
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

      {/* HEADER (STICKY) */}
      <div className="sticky top-0 bg-white z-10 pb-3 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Order #{order.id}
          </h2>

          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold
              ${order.status === "open" && "bg-gray-200 text-gray-700"}
              ${order.status === "preparing" && "bg-blue-100 text-blue-700"}
              ${order.status === "served" && "bg-green-100 text-green-700"}
              ${order.status === "paid" && "bg-gray-800 text-white"}
            `}
          >
            {order.status}
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Table #{order.table}
        </p>
      </div>

      {/* ITEMS (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3">
        {items.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            No items added
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded-lg p-3"
          >
            <div>
              <p className="font-medium">
                {item.product_name}
              </p>
              <p className="text-xs text-gray-500">
                ${Number(item.product_price).toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={isLocked || item.quantity <= 1}
                onClick={() =>
                  onQtyChange(item.id, item.quantity - 1)
                }
                className="w-7 h-7 rounded bg-gray-200"
              >
                −
              </button>

              <span className="w-6 text-center">
                {item.quantity}
              </span>

              <button
                disabled={isLocked}
                onClick={() =>
                  onQtyChange(item.id, item.quantity + 1)
                }
                className="w-7 h-7 rounded bg-gray-200"
              >
                +
              </button>

              <button
                disabled={isLocked}
                onClick={() => onRemove(item.id)}
                className="text-red-500 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER (STICKY) */}
      <div className="sticky bottom-0 bg-white border-t pt-4">
        <div className="flex justify-between text-lg font-bold mb-3">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {order.status === "open" && items.length > 0 && (
          <button
            onClick={onSendToKitchen}
            className="w-full mb-2 bg-blue-600 text-white py-2.5 rounded-lg"
          >
            Send to Kitchen
          </button>
        )}

        <button
          disabled={items.length === 0 || isLocked}
          onClick={() => setShowPayment(true)}
          className="w-full bg-orange-500 text-white py-2.5 rounded-lg"
        >
          Bill & Payment
        </button>

        {order.status === "open" && items.length === 0 && (
          <button
            onClick={onCancelEmpty}
            className="w-full mt-2 text-sm text-red-600"
          >
            Cancel Order
          </button>
        )}
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





