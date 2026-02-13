import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle, X } from "lucide-react";

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
      <div className="bg-white rounded-2xl w-[420px] shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">
            Bill & Payment
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* TOTAL */}
          <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-gray-600 font-medium">
              Total Amount
            </span>
            <span className="text-2xl font-bold text-orange-600">
              ${total.toFixed(2)}
            </span>
          </div>

          {/* PAYMENT METHODS */}
          <div className="space-y-3">
            {[
              { id: "cash", label: "Cash" },
              { id: "bank", label: "Bank / Card" },
              { id: "digital", label: "Digital / Wallet" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-3 rounded-xl border transition
                  ${
                    method === m.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <span className="font-medium">
                  {m.label}
                </span>
                {method === m.id && (
                  <CheckCircle className="text-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border rounded-xl py-2"
          >
            Cancel
          </button>

          <button
            onClick={handlePay}
            disabled={loading}
            className="flex-1 bg-green-600 text-white rounded-xl py-2 hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
