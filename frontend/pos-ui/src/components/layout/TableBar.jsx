export default function TableBar({
  tables = [],
  selectedTable,
  onSelectTable,
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {tables.map((t) => {
        const isSelected = selectedTable === t.id;
        const isOccupied = t.is_occupied;

        return (
          <button
            key={t.id}
            onClick={() => onSelectTable(t.id)}
            className={`
              min-w-[96px]
              px-4 py-2
              rounded-xl
              text-sm font-semibold
              transition
              flex flex-col items-center
              ${
                isSelected
                  ? "bg-orange-500 text-white shadow-md"
                  : isOccupied
                  ? "bg-orange-50 text-orange-700 border border-orange-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }
            `}
          >
            <span>Table {t.number}</span>

            {isOccupied && !isSelected && (
              <span className="text-[10px] mt-1 uppercase tracking-wide">
                Occupied
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
