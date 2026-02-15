import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Timer } from "lucide-react";
import KOTCard from "./KOTCard";

const API = "https://restaurant-management-2lef.onrender.com/api";
//const API = "http://127.0.0.1:8000/api";

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const prevOrderIds = useRef(new Set());

  const playSound = () => {
    const audio = new Audio("/new_order.mp3");
    audio.play().catch(() => {
        console.log("Sound blocked by browser. Interaction required.");
    });
  };

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/`);
      const filtered = res.data.filter((o) => o.status === "preparing");

      // 🔔 Detect NEW orders
      const currentIds = filtered.map(o => o.id);
      const hasNew = currentIds.some(id => !prevOrderIds.current.has(id));

      if (hasNew) playSound();

      prevOrderIds.current = new Set(currentIds);
      setOrders(filtered);
    } catch (err) {
      console.error("KDS Fetch Error:", err);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // 5s for faster kitchen response
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-sans">
      {/* KDS HEADER */}
      <div className="flex items-center justify-between mb-10 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            <ChefHat size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">KITCHEN COMMAND</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              Live Order Stream • {orders.length} Active Tickets
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">System Live</span>
        </div>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[50vh] opacity-20">
          <ChefHat size={80} strokeWidth={1} />
          <p className="text-xl font-bold mt-4">Kitchen is Clear</p>
        </div>
      )}

      {/* ORDERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <KOTCard order={order} onUpdate={loadOrders} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}