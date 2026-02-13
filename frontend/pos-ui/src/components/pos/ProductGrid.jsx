import { useState } from "react";
import ProductCard from "./ProductCard";

const CATEGORIES = ["All", "Rice", "Beverages", "Pizza"];

export default function ProductGrid({ products = [], onAdd }) {
  const [active, setActive] = useState("All");

return (
  <div className="flex flex-col h-full">
    

    {/* FILTERS (STICKY) */}
    <div className="sticky top-0 bg-white z-10 pb-3">
      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
              ${
                active === c
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-100"
              }
            `}
          >
            {c}
          </button>
        ))}
      </div>
    </div>

    {/* PRODUCTS (SCROLLABLE) */}
    
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 overflow-y-auto">
  
      {products.length === 0 && (
        <p className="col-span-full text-center text-gray-500 mt-10">
          No products
        </p>
      )}

      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAdd={onAdd}
        />
      ))}
    </div>
  </div>
);


}
