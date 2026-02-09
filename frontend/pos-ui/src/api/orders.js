import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export const getOrCreateOrder = async (tableId) => {
  const res = await axios.get(`${API}/orders/by-table/${tableId}/`);
  return res.data;
};
