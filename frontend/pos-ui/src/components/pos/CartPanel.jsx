import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, Send, XCircle } from "lucide-react";

// Use your production API
const API = "https://restaurant-management-2lef.onrender.com/api";
//const API = "http://127.0.0.1:8000/api";
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

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-white rounded-[2.5rem]">
      <p className="text-slate-400 animate-pulse font-medium">Loading order...</p>
    </div>
  );

  if (!order) return (
    <div className="h-full flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-8">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
        <ShoppingBag size={32} />
      </div>
      <p className="text-slate-400 font-medium">Select a table to start</p>
    </div>
  );

  const isLocked = ["paid", "cancelled"].includes(order.status);

  const total = items.reduce(
    (sum, item) => sum + Number(item.product_price) * item.quantity,
    0
  );

  /* ---------- PAYMENT LOGIC ---------- */
  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await axios.post(
        `${API}/orders/${order.id}/close/`,
        { payment_method: paymentMethod }
      );

      toast.success("Payment completed");
      setShowPayment(false);

      // Pass data back to POSPage to trigger receipt and reset
      onOrderPaid({
        ...order,
        status: "paid",
        payment_method: paymentMethod,
        total: res.data.total,
        items: items,
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-6 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">Order #{order.id}</h2>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">Table {order.table}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
          ${order.status === "open" ? "bg-emerald-100 text-emerald-600" : 
            order.status === "preparing" ? "bg-blue-100 text-blue-600" : 
            "bg-slate-100 text-slate-600"}
        `}>
          {order.status}
        </span>
      </div>

      {/* ITEMS LIST (Scrollable) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
        {items.length === 0 ? (
          <div className="text-center py-10 opacity-30">
            <p className="text-sm font-medium">No items added yet</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 group animate-in fade-in slide-in-from-right-2">
              {/* IMAGE FIX: Uses item.product_image or fallback */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-50">
                <img 
                  src={item.product_image || `https://placehold.co/100x100?text=${item.product_name}`} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-700 truncate">{item.product_name}</h4>
                <p className="text-[10px] text-indigo-500 font-black">${Number(item.product_price).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-2 py-1">
                <button 
                  disabled={isLocked || item.quantity <= 1}
                  onClick={() => onQtyChange(item.id, item.quantity - 1)}
                  className="w-5 h-5 flex items-center justify-center hover:text-indigo-600 disabled:opacity-30"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-bold w-4 text-center text-slate-700">{item.quantity}</span>
                <button 
                  disabled={isLocked}
                  onClick={() => onQtyChange(item.id, item.quantity + 1)}
                  className="w-5 h-5 flex items-center justify-center hover:text-indigo-600 disabled:opacity-30"
                >
                  <Plus size={12} />
                </button>
              </div>

              <button 
                disabled={isLocked}
                onClick={() => onRemove(item.id)}
                className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-6 pt-6 border-t border-slate-50 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400 font-bold text-sm uppercase tracking-tight">Total</span>
          <span className="text-2xl font-black text-slate-800">${total.toFixed(2)}</span>
        </div>

        <div className="space-y-3">
          {order.status === "open" && items.length > 0 && (
            <button
              onClick={onSendToKitchen}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all"
            >
              <Send size={16} /> Send to Kitchen
            </button>
          )}

          <button
            disabled={items.length === 0 || isLocked}
            onClick={() => setShowPayment(true)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <CreditCard size={18} /> Proceed to Payment
          </button>

          {order.status === "open" && items.length === 0 && (
            <button
              onClick={onCancelEmpty}
              className="w-full py-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center justify-center gap-1"
            >
              <XCircle size={14} /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* MODERN PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Checkout</h2>
            <p className="text-slate-400 text-sm mb-6 font-medium border-b pb-4">Order Total: <span className="text-indigo-600 font-bold">${total.toFixed(2)}</span></p>

            <div className="space-y-3 mb-8">
              {["cash", "bank", "digital"].map((m) => (
                <label key={m} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer
                  ${paymentMethod === m ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:border-slate-200"}`}>
                  <span className="capitalize font-bold text-slate-700">{m}</span>
                  <input
                    type="radio"
                    className="w-5 h-5 accent-indigo-600"
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={paying}
                className="flex-1 bg-indigo-600 text-white rounded-2xl font-bold py-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {paying ? "..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}