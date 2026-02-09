import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export const updateQuantity = (itemId, quantity) => {
  return axios.patch(`${API}/order-items/${itemId}/`, {
    quantity,
  });
};

export const removeItem = (itemId) => {
  return axios.delete(`${API}/order-items/${itemId}/`);
};
