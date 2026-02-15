import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, CheckCircle2, Hash } from "lucide-react";

const API = "https://restaurant-management-2lef.onrender.com/api";
//const API = "http://127.0.0.1:8000/api";

export default function KOTCard({ order, onUpdate }) {
  const [elapsed, setElapsed] = useState("");

  // Calculate time since order created
  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(order.created_at || new Date()); // Ensure your API sends created_at
      const diff = Math.floor((new Date() - start) / 60000);
      setElapsed(`${diff} min`);
    }, 1000);
    return () => clearInterval(timer);
  }, [order.created_at]);

  const markServed = async () => {
    try {
      await axios.post(`${API}/orders/${order.id}/mark_served/`);
      onUpdate();
    } catch (err) {
      console.error("Failed to serve order");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-full group">
      {/* TICKET HEADER */}
      <div className={`p-5 flex justify-between items-start ${
        parseInt(elapsed) > 15 ? 'bg-red-500/10 border-b border-red-500/20' : 'bg-slate-800/50 border-b border-slate-800'
      }`}>
        <div>
          <h2 className="text-2xl font-black text-white leading-none flex items-center gap-2">
            <span className="text-slate-500 text-sm font-bold uppercase">Table</span> {order.table}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Hash size={12} /> {order.id}
          </div>
        </div>
        
        <div className={`px-3 py-2 rounded-xl flex items-center gap-2 border ${
            parseInt(elapsed) > 15 ? 'bg-red-500 text-white border-red-400' : 'bg-slate-900 border-slate-700 text-indigo-400'
        }`}>
          <Clock size={14} />
          <span className="text-xs font-black">{elapsed}</span>
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="p-6 flex-1">
        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between items-center group/item">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-200 group-hover/item:text-indigo-400 transition-colors">
                  {item.product_name}
                </span>
                {item.notes && <span className="text-xs text-orange-400 italic">No onions, extra spicy</span>}
              </div>
              <span className="bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border border-slate-700">
                {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ACTION BUTTON */}
      <div className="p-4 bg-slate-800/30 border-t border-slate-800">
        <button
          onClick={markServed}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <CheckCircle2 size={18} /> Complete Order
        </button>
      </div>
    </div>
  );
}