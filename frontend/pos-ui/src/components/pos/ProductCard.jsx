export default function ProductCard({ product, onAdd }) {
  return (
    <button
      onClick={() => onAdd(product.id)}
      className="group bg-white rounded-xl border hover:border-orange-400 transition p-3 text-left active:scale-[0.98]"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-28 object-cover rounded-lg mb-2"
        />
      </div>

      <h3 className="font-medium text-sm truncate">
        {product.name}
      </h3>

      <p className="text-orange-600 font-bold text-sm mt-1">
        ${Number(product.price).toFixed(2)}
      </p>
    </button>
  );
}
