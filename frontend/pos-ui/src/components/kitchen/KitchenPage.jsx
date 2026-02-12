import { useEffect, useRef, useState } from "react";
import axios from "axios";
import KOTCard from "./KOTCard";

const API = "http://127.0.0.1:8000/api";

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const prevOrderIds = useRef(new Set());

  const playSound = () => {
    const audio = new Audio("../assets/new_order.mp3");
    audio.play().catch(() => {});
  };

  const loadOrders = async () => {
    const res = await axios.get(`${API}/orders/`);
    const filtered = res.data.filter(
      (o) => o.status === "preparing"
    );

    // 🔔 detect NEW orders
    const newOrders = filtered.filter(
      (o) => !prevOrderIds.current.has(o.id)
    );

    if (newOrders.length > 0) {
      playSound();
    }

    // update known order ids
    prevOrderIds.current = new Set(filtered.map((o) => o.id));
    setOrders(filtered);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Kitchen Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orders.map((order) => (
          <KOTCard
            key={order.id}
            order={order}
            onUpdate={loadOrders}
          />
        ))}
      </div>
    </div>
  );
}
