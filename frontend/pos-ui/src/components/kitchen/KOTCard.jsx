import axios from "axios";

const API = "http://127.0.0.1:8000/api";

const STATUS_COLORS = {
  open: "bg-gray-200 text-gray-700",
  preparing: "bg-blue-100 text-blue-700",
  served: "bg-green-100 text-green-700",
  paid: "bg-gray-800 text-white",
};

export default function KOTCard({ order, onUpdate }) {
  const markServed = async () => {
    await axios.post(`${API}/orders/${order.id}/mark_served/`);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 border">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">
          Table {order.table}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            STATUS_COLORS[order.status]
          }`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      {/* ORDER ID */}
      <p className="text-xs text-gray-400 mb-2">
        Order #{order.id}
      </p>

      {/* ITEMS */}
      <ul className="text-sm space-y-1 mb-4">
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity} × {item.product_name}
          </li>
        ))}
      </ul>

      {/* ACTION */}
      {order.status === "preparing" ? (
        <button
          onClick={markServed}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Mark as Served
        </button>
      ) : (
        <div className="text-center text-green-700 font-semibold">
          ✔ Served
        </div>
      )}
    </div>
  );
}
