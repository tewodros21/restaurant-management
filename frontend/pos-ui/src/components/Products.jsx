import React from "react";

const BACKEND_URL = "http://127.0.0.1:8000";
const PLACEHOLDER = "https://via.placeholder.com/150?text=No+Image";

const getImageUrl = (image) => {
  if (!image) return PLACEHOLDER;
  if (image.startsWith("http")) return image;
  return `${BACKEND_URL}${image}`;
};

export default function Products({ products, onAdd }) {
  return (
    <div className="col-span-6 p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No products available
          </p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onAdd(product)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1"
          >
            <div className="w-full h-40 mb-3 overflow-hidden rounded">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-semibold text-lg text-gray-800">
              {product.name}
            </h3>
            <p className="text-gray-600 mt-1">
              ${Number(product.price).toFixed(2)}
            </p>

            <button className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
              Add to Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
