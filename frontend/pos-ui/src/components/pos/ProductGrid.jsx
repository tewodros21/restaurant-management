import { useState } from "react";
import ProductCard from "./ProductCard";

const CATEGORIES = ["All", "Rice", "Beverages", "Pizza"];

export default function ProductGrid({ products = [], onAdd }) {
  const [active, setActive] = useState("All");

  return (
    <div className="flex flex-col h-full">
      {/* FILTERS */}
      <div className="flex gap-2 mb-4">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition
              ${
                active === c
                  ? "bg-orange-500 text-white shadow"
                  : "bg-gray-100 hover:bg-orange-100 text-gray-600"
              }
            `}
          >
            {c}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-4 gap-5 overflow-y-auto">
        {products.length === 0 && (
          <p className="col-span-full text-gray-500 text-center mt-10">
            No products available
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
