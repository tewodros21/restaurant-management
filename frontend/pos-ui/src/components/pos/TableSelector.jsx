export default function TableSelector({
  tables = [],
  selectedTable,
  onSelectTable,
}) {
  return (
    <div className="mb-4 space-y-3">
      {/* Dining Type (static for now) 
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Select Dining
        </label>
        <select
          disabled
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
        >
          <option>Dine In</option>
          <option>Takeaway (coming soon)</option>
          <option>Delivery (coming soon)</option>
        </select>
      </div>
*/}
      {/* Table Selector */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Select Table
        </label>
        <div className="grid grid-cols-2 gap-2">
  {tables.map((t) => (
    <button
      key={t.id}
      disabled={t.is_occupied}
      onClick={() => onSelectTable(t.id)}
      className={`rounded-lg p-3 text-sm font-semibold
        ${selectedTable === t.id ? "bg-orange-500 text-white" : ""}
        ${t.is_occupied ? "bg-gray-200 text-gray-400" : "bg-gray-100 hover:bg-orange-100"}
      `}
    >
      Table {t.number}
    </button>
  ))}
</div>

      </div>
    </div>
  );
}
