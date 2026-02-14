import axios from "axios";
import { Clock } from "lucide-react";

//const API = "http://127.0.0.1:8000/api";
const API = "https://restaurant-management-2lef.onrender.com/api";

const STATUS_COLORS = {
  open: "bg-gray-500",
  preparing: "bg-blue-600",
  served: "bg-green-600",
  paid: "bg-gray-800",
};

export default function KOTCard({ order, onUpdate }) {
  const markServed = async () => {
    await axios.post(`${API}/orders/${order.id}/mark_served/`);
    onUpdate();
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-700">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">
          Table {order.table}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            STATUS_COLORS[order.status]
          }`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* META */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
        <Clock size={14} />
        Order #{order.id}
      </div>

      {/* ITEMS */}
      <ul className="text-sm space-y-1 mb-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.product_name}</span>
            <span className="font-semibold">
              × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

      {/* ACTION */}
      {order.status === "preparing" ? (
        <button
          onClick={markServed}
          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 text-sm font-semibold"
        >
          Mark as Served
        </button>
      ) : (
        <div className="text-center text-green-400 font-semibold">
          ✔ Served
        </div>
      )}
    </div>
  );
}
