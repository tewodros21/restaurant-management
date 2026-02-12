import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppLayout from "./components/layout/AppLayout";
import POSPage from "./components/pos/POSPage";
import KitchenPage from "./components/kitchen/KitchenPage";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
            fontWeight: "500",
          },
        }}
      />

      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<POSPage />} />
          <Route path="/pos" element={<POSPage />} />

          {/* 🔥 KITCHEN */}
          <Route path="/kitchen" element={<KitchenPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
