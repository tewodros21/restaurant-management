import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CartContext = createContext();
const API = "http://127.0.0.1:8000/api";

export function CartProvider({ children }) {
  const [order, setOrder] = useState(null);

  // ✅ Ensure open order
  const ensureOrder = async (tableId = null) => {
    if (order && order.status === "open") return order;

    const res = await axios.post(`${API}/orders/`, {
      table: tableId,
    });

    setOrder(res.data);
    return res.data;
  };

  // ✅ Add product (merge quantity if exists)
  const addToCart = async (product) => {
    const currentOrder = await ensureOrder();

    const existing = currentOrder.items.find(
      (i) => i.product === product.id
    );

    if (existing) {
      await updateQty(existing.id, existing.quantity + 1);
    } else {
      await axios.post(`${API}/order-items/`, {
        order: currentOrder.id,
        product: product.id,
        quantity: 1,
      });
    }

    refreshOrder(currentOrder.id);
  };

  const updateQty = async (itemId, quantity) => {
    await axios.patch(`${API}/order-items/${itemId}/`, { quantity });
    refreshOrder(order.id);
  };

  const removeItem = async (itemId) => {
    await axios.delete(`${API}/order-items/${itemId}/`);
    refreshOrder(order.id);
  };

  const closeOrder = async (paymentMethod) => {
    const res = await axios.post(
      `${API}/orders/${order.id}/close/`,
      { payment_method: paymentMethod }
    );

    toast.success(`Order paid • $${res.data.total_amount}`);
    setOrder(null);
  };

  const cancelOrder = async () => {
    await axios.post(`${API}/orders/${order.id}/cancel/`);
    toast.success("Order cancelled");
    setOrder(null);
  };

  const refreshOrder = async (id) => {
    const res = await axios.get(`${API}/orders/${id}/`);
    setOrder(res.data);
  };

  return (
    <CartContext.Provider
      value={{
        order,
        addToCart,
        updateQty,
        removeItem,
        closeOrder,
        cancelOrder,
        ensureOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
