import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import POSPage from "./components/pos/POSPage";

export default function App() {
  return (
    <>
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

      <AppLayout>
        <POSPage />
      </AppLayout>
    </>
  );
}
