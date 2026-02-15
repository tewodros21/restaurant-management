import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Components
import TableBar from "../layout/TableBar";
import ProductGrid from "./ProductGrid";
import CartPanel from "./CartPanel";
import ReceiptModal from "./ReceiptModal";

// Use your preferred API (Local or Render)
//const API = "http://127.0.0.1:8000/api"; 
const API = "https://restaurant-management-2lef.onrender.com/api";
//const API = import.meta.env.VITE_API_URL;


export default function POSPage() {
  /* ---------- STATE ---------- */
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Receipt States
  const [showReceipt, setShowReceipt] = useState(false);
  const [paidOrder, setPaidOrder] = useState(null);
  const [paidItems, setPaidItems] = useState([]);

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, tableRes] = await Promise.all([
          axios.get(`${API}/products/`),
          axios.get(`${API}/tables/`)
        ]);
        setProducts(prodRes.data);
        setTables(tableRes.data);
      } catch (err) {
        toast.error("Server connection failed");
      }
    };
    loadData();
  }, []);

  /* ---------- HELPERS ---------- */
  const refreshTables = async () => {
    const res = await axios.get(`${API}/tables/`);
    setTables(res.data);
  };

  const refreshOrder = async (orderId) => {
    const id = orderId || order?.id;
    if (!id) return;
    const res = await axios.get(`${API}/orders/${id}/`);
    setOrder(res.data);
    setItems(res.data.items || []);
  };

  /* ---------- HANDLERS ---------- */
  const handleTableSelect = async (tableId) => {
    setSelectedTable(tableId);
    setLoadingOrder(true);
    try {
      const res = await axios.get(`${API}/orders/by-table/${tableId}/`);
      setOrder(res.data);
      setItems(res.data.items || []);
      await refreshTables();
    } catch (err) {
      setOrder(null);
      setItems([]);
      toast.error("Failed to load table order");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!order) return toast.error("Select a table first");
    try {
      await axios.post(`${API}/order-items/`, {
        order: order.id,
        product: productId,
        quantity: 1,
      });
      await refreshOrder();
      await refreshTables();
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const updateItemQty = async (itemId, newQty) => {
    try {
      if (newQty <= 0) {
        await axios.delete(`${API}/order-items/${itemId}/`);
      } else {
        await axios.patch(`${API}/order-items/${itemId}/`, { quantity: newQty });
      }
      
      const res = await axios.get(`${API}/orders/${order.id}/`);
      if (!res.data.items || res.data.items.length === 0) {
        setOrder(null);
        setItems([]);
        setSelectedTable(null);
        await refreshTables();
      } else {
        setOrder(res.data);
        setItems(res.data.items);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${API}/order-items/${itemId}/`);
      const res = await axios.get(`${API}/orders/${order.id}/`);
      if (!res.data.items || res.data.items.length === 0) {
        setOrder(null);
        setItems([]);
        setSelectedTable(null);
        await refreshTables();
      } else {
        setOrder(res.data);
        setItems(res.data.items);
      }
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  const handleSendToKitchen = async () => {
    if (!order) return;
    try {
      await axios.post(`${API}/orders/${order.id}/send_to_kitchen/`);
      toast.success("Order sent to kitchen");
      await refreshOrder();
    } catch (err) {
      toast.error("Failed to send to kitchen");
    }
  };

  const handleCancelEmpty = async () => {
    if (!order) return;
    try {
      await axios.post(`${API}/orders/${order.id}/cancel/`);
      toast.success("Order cancelled");
      setOrder(null);
      setItems([]);
      setSelectedTable(null);
      await refreshTables();
    } catch (err) {
      toast.error("Cancel failed");
    }
  };

  const handleOrderPaid = (closedOrder) => {
    setPaidOrder(closedOrder);
    setPaidItems(items);
    setShowReceipt(true);
    // Reset UI
    setOrder(null);
    setItems([]);
    setSelectedTable(null);
    refreshTables();
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] p-6 bg-[#F8F9FD]">
      
      {/* LEFT SIDE: Tables & Products */}
      <div className="flex-1 flex flex-col min-w-0 space-y-6">
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100">
          <TableBar
            tables={tables}
            selectedTable={selectedTable}
            onSelectTable={handleTableSelect}
          />
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <ProductGrid products={products} onAdd={handleAddToCart} />
        </div>
      </div>

      {/* RIGHT SIDE: Cart Panel */}
      <div className="w-full lg:w-[420px] h-full">
        <CartPanel
          order={order}
          items={items}
          loading={loadingOrder}
          onQtyChange={updateItemQty}
          onRemove={removeItem}
          onOrderPaid={handleOrderPaid}
          onCancelEmpty={handleCancelEmpty}
          onSendToKitchen={handleSendToKitchen}
        />
      </div>

      {/* MODALS */}
      {showReceipt && (
        <ReceiptModal
          order={paidOrder}
          items={paidItems}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}