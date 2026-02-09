export default function ProductCard({ product, onAdd }) {
  return (
    <button
      onClick={() => onAdd(product.id)}
      className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 text-left"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-28 object-cover rounded-lg mb-2"
      />

      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-orange-500 font-bold">
        ${Number(product.price).toFixed(2)}
      </p>
    </button>
  );
}
