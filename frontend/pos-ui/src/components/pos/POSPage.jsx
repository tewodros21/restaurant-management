import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


import TableSelector from "./TableSelector";
import ProductGrid from "./ProductGrid";
import CartPanel from "./CartPanel";

const API = "http://127.0.0.1:8000/api";

export default function POSPage() {
  /* ---------- STATE ---------- */
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const [loadingOrder, setLoadingOrder] = useState(false);

  /* ---------- LOAD PRODUCTS & TABLES ---------- */
  useEffect(() => {
    axios.get(`${API}/products/`).then((res) => setProducts(res.data));
    axios.get(`${API}/tables/`).then((res) => setTables(res.data));
  }, []);

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
    } catch (err) {
      console.error(err);
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
      toast.success("Item added to cart");
    } catch (err) {
      console.error(err);
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

      await refreshOrder();
      toast.success(
      newQty > 1 ? "Quantity increased" : "Quantity decreased"
      );
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
      await refreshOrder();

      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };
  const handleOrderPaid = async () => {
    setOrder(null);
    setItems([]);
    setSelectedTable(null);

    // refresh tables (important!)
    const res = await axios.get(`${API}/tables/`);
    setTables(res.data);
  };
  

  /* ---------- REFRESH ORDER ---------- */
  const refreshOrder = async () => {
    const res = await axios.get(`${API}/orders/${order.id}/`);
    setOrder(res.data);
    setItems(res.data.items || []);
  };
  

  /* ---------- UI ---------- */
  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* TABLES */}
      <div className="col-span-3 bg-white rounded-2xl p-4 shadow">
        <TableSelector
          tables={tables}
          selectedTable={selectedTable}
          onSelectTable={handleTableSelect}
        />
      </div>

      {/* PRODUCTS */}
      <div className="col-span-5 bg-white rounded-2xl p-4 shadow">
        <ProductGrid
          products={products}
          onAdd={handleAddToCart}
        />
      </div>

      {/* CART */}
      <div className="col-span-4 bg-white rounded-2xl p-4 shadow">
        <CartPanel
        order={order}
        items={items}
        loading={loadingOrder}
        onQtyChange={updateItemQty}
        onRemove={removeItem}
        onOrderPaid={handleOrderPaid}
      />

      </div>
    </div>
  );
}
