export default function TableBar({
  tables = [],
  selectedTable,
  onSelectTable,
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {tables.map((t) => {
        const isSelected = selectedTable === t.id;

        return (
          <button
            key={t.id}
            onClick={() => onSelectTable(t.id)}
            className={`min-w-[90px] px-4 py-2 rounded-xl text-sm font-semibold transition
              ${
                isSelected
                  ? "bg-orange-500 text-white shadow"
                  : t.is_occupied
                  ? "bg-orange-50 text-orange-700 border border-orange-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span>Table {t.number}</span>
              {t.is_occupied && !isSelected && (
                <span className="text-[10px] mt-1">Occupied</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
