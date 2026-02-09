import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://127.0.0.1:8000/api";

export default function PaymentModal({ order, total, onClose, onPaid }) {
  const [method, setMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

    const handlePay = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${API}/orders/${order.id}/close/`,
        { payment_method: method }
      );

      toast.success("Payment successful");
      onPaid();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Bill & Payment
        </h2>

        {/* TOTAL */}
        <div className="flex justify-between text-lg font-semibold mb-6">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* PAYMENT METHODS */}
        <div className="space-y-3 mb-6">
          {["cash", "bank", "digital"].map((m) => (
            <label
              key={m}
              className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer
                ${method === m ? "border-orange-500 bg-orange-50" : ""}
              `}
            >
              <span className="capitalize font-medium">
                {m}
              </span>
              <input
                type="radio"
                checked={method === m}
                onChange={() => setMethod(m)}
              />
            </label>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={handlePay}
            disabled={loading}
            className="flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
