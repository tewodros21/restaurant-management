export default function Tables({ tables, selectedTable, onSelect }) {
  return (
    <div className="col-span-2 bg-slate-900 text-white p-4 rounded-r-xl">
      <h2 className="text-lg font-semibold mb-5 tracking-wide">
        Tables
      </h2>

      <div className="space-y-3">
        {tables.map((table) => {
          const isSelected = selectedTable === table.id;
          const isOccupied = table.is_occupied;

          return (
            <button
              key={table.id}
              onClick={() => onSelect(table.id)}
              className={`
                w-full flex items-center justify-between px-4 py-4 rounded-xl
                text-lg font-semibold transition
                ${isOccupied ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                ${isSelected ? "ring-4 ring-white/60 scale-[1.02]" : ""}
              `}
            >
              {/* Table Info */}
              <div className="text-left">
                <p>Table {table.number}</p>
                <p className="text-sm opacity-80">
                  {isOccupied ? "Occupied" : "Available"}
                </p>
              </div>

              {/* Status Dot */}
              <span
                className={`w-3 h-3 rounded-full ${
                  isOccupied ? "bg-red-300" : "bg-green-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
