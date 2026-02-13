export default function TableSelector({
  tables = [],
  selectedTable,
  onSelectTable,
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">Select Table</p>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {tables.map((t) => {
          const isSelected = selectedTable === t.id;

          return (
            <button
              key={t.id}
              onClick={() => onSelectTable(t.id)}
              className={`
                min-w-[96px]
                px-4 py-3
                rounded-xl
                text-sm font-semibold
                transition
                flex flex-col items-center
                ${
                  isSelected
                    ? "bg-orange-500 text-white shadow"
                    : t.is_occupied
                    ? "bg-orange-50 text-orange-700 border border-orange-300"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              <span>Table {t.number}</span>

              {t.is_occupied && !isSelected && (
                <span className="text-[10px] mt-1 uppercase tracking-wide">
                  Occupied
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
