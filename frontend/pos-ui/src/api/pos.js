// src/api/pos.js
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export const addToCart = (orderId, productId) => {
  return axios.post(`${API}/order-items/`, {
    order: orderId,
    product: productId,
    quantity: 1,
  });
};
