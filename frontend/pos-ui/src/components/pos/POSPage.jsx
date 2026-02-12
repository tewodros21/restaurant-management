import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


import TableSelector from "./TableSelector";
import ProductGrid from "./ProductGrid";
import CartPanel from "./CartPanel";
import TableBar from "../layout/TableBar";
import ReceiptModal from "./ReceiptModal";



const API = "http://127.0.0.1:8000/api";

export default function POSPage() {
  /* ---------- STATE ---------- */
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [showReceipt, setShowReceipt] = useState(false);
  const [paidOrder, setPaidOrder] = useState(null);

  const [paidItems, setPaidItems] = useState([]);



  const [loadingOrder, setLoadingOrder] = useState(false);

  /* ---------- LOAD PRODUCTS & TABLES ---------- */
  useEffect(() => {
    axios.get(`${API}/products/`).then((res) => setProducts(res.data));
    axios.get(`${API}/tables/`).then((res) => setTables(res.data));
  }, []);

 
  const refreshTables = async () => {
    const res = await axios.get(`${API}/tables/`);
    setTables(res.data);
  };

  // other handlers below...



  /* ---------- SELECT TABLE ---------- */
 const handleTableSelect = async (tableId) => {
  setSelectedTable(tableId);
  setLoadingOrder(true);

  try {
    const res = await axios.get(
      `${API}/orders/by-table/${tableId}/`
    );

    setOrder(res.data);
    setItems(res.data.items || []);

    // 🔥 THIS LINE FIXES YOUR ISSUE
    await refreshTables();

  } catch (err) {
    toast.error("Failed to load order");
  } finally {
    setLoadingOrder(false);
  }
};



  /* ---------- ADD TO CART ---------- */
const handleAddToCart = async (productId) => {
  if (!order) {
    toast.error("Select a table first");
    return;
  }

  try {
    await axios.post(`${API}/order-items/`, {
      order: order.id,
      product: productId,
      quantity: 1,
    });

    await refreshOrder();
    await refreshTables(); // 👈 important

  } catch (err) {
    toast.error("Failed to add item");
  }
};

  /* ---------- UPDATE QUANTITY ---------- */
  const updateItemQty = async (itemId, newQty) => {
  if (!order) return;

  try {
    if (newQty <= 0) {
      await axios.delete(`${API}/order-items/${itemId}/`);
    } else {
      await axios.patch(`${API}/order-items/${itemId}/`, {
        quantity: newQty,
      });
    }

    const res = await axios.get(`${API}/orders/${order.id}/`);

    if (!res.data.items || res.data.items.length === 0) {
      setOrder(null);
      setItems([]);
      setSelectedTable(null);

      const tablesRes = await axios.get(`${API}/tables/`);
      setTables(tablesRes.data);
    } else {
      setOrder(res.data);
      setItems(res.data.items);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update quantity");
  }
};

  /* ---------- REMOVE ITEM ---------- */
  const removeItem = async (itemId) => {
  if (!order) return;

  try {
    await axios.delete(`${API}/order-items/${itemId}/`);

    // 🔄 Refresh order
    const res = await axios.get(`${API}/orders/${order.id}/`);

    // 🧹 If backend auto-cancelled empty order
    if (!res.data.items || res.data.items.length === 0) {
      setOrder(null);
      setItems([]);
      setSelectedTable(null);

      // 🔁 Refresh tables so table becomes free
      const tablesRes = await axios.get(`${API}/tables/`);
      setTables(tablesRes.data);
    } else {
      setOrder(res.data);
      setItems(res.data.items);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to remove item");
  }
};


const handleOrderPaid = async (closedOrder) => {
  // save receipt data BEFORE clearing UI
  setPaidOrder(closedOrder);
  setPaidItems(items); // VERY IMPORTANT
  setShowReceipt(true);

  // reset POS UI
  setOrder(null);
  setItems([]);
  setSelectedTable(null);

  // refresh tables
  const res = await axios.get(`${API}/tables/`);
  setTables(res.data);
};


  
const handleCancelEmpty = async () => {
  if (!order) return;

  try {
    await axios.post(`${API}/orders/${order.id}/cancel/`);

    toast.success("Order cancelled");

    // Reset UI
    setOrder(null);
    setItems([]);
    setSelectedTable(null);

    // Refresh tables so table becomes free
    await refreshTables();
  } catch (err) {
    console.error(err);
    toast.error("Failed to cancel order");
  }
};

  const handleSendToKitchen = async () => {
    try {
      await axios.post(`${API}/orders/${order.id}/send_to_kitchen/`);

      toast.success("Sent to kitchen");

      const res = await axios.get(`${API}/orders/${order.id}/`);
      setOrder(res.data);

    } catch (err) {
      toast.error("Failed to send to kitchen");
    }
  };


  /* ---------- REFRESH ORDER ---------- */
  const refreshOrder = async () => {
    const res = await axios.get(`${API}/orders/${order.id}/`);
    setOrder(res.data);
    setItems(res.data.items || []);
  };
  

  /* ---------- UI ---------- */
return (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
    
    {/* PRODUCTS + TABLE BAR */}
    <div className="lg:col-span-8 bg-white rounded-2xl p-4 shadow flex flex-col">
      <TableBar
        tables={tables}
        selectedTable={selectedTable}
        onSelectTable={handleTableSelect}
      />

      <div className="border-b my-4" />

      <ProductGrid
        products={products}
        onAdd={handleAddToCart}
      />
    </div>

    {/* CART */}
    <div className="lg:col-span-4 bg-white rounded-2xl p-4 shadow">
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

    {/* RECEIPT */}
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
