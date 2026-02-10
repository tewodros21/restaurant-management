export default function TableSelector({
  tables = [],
  selectedTable,
  onSelectTable,
}) {
  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-500">
        Select Table
      </label>

      <div className="grid grid-cols-2 gap-3">
        {tables.map((t) => {
          const isSelected = selectedTable === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onSelectTable(t.id)}
              className={`relative rounded-xl p-4 text-sm font-semibold transition
                ${
                  isSelected
                    ? "bg-orange-500 text-white shadow"
                    : t.is_occupied
                    ? "bg-orange-50 text-orange-700 border border-orange-300 hover:bg-orange-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span>Table {t.number}</span>

                {t.is_occupied && !isSelected && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 text-orange-800">
                    Occupied
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
