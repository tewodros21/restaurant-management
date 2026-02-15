import { motion } from "framer-motion";

export default function TableBar({ tables = [], selectedTable, onSelectTable }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {tables.map((t) => {
        const isSelected = selectedTable === t.id;
        const isOccupied = t.is_occupied;

        return (
          <motion.button
            key={t.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTable(t.id)}
            className={`
              relative min-w-[130px] h-14
              px-5 py-2 rounded-2xl
              text-sm font-bold transition-all duration-300
              flex flex-col items-center justify-center
              ${isSelected
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200 -translate-y-1"
                  : isOccupied
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "bg-white text-slate-500 border border-slate-100 hover:border-orange-300 hover:text-orange-500"
              }
            `}
          >
            {/* Top Row: Dot + Table Number */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                isSelected ? 'bg-white' : isOccupied ? 'bg-orange-400' : 'bg-emerald-400'
              }`} />
              <span className="tracking-tight">Table {t.number}</span>
            </div>

            {/* Bottom Row: Status Text */}
            {isOccupied && (
              <span className={`text-[9px] uppercase font-black tracking-widest mt-0.5 ${
                isSelected ? 'text-orange-100' : 'text-orange-400'
              }`}>
                Occupied
              </span>
            )}
            
            {!isOccupied && !isSelected && (
              <span className="text-[9px] uppercase font-bold tracking-widest mt-0.5 text-slate-300">
                Available
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}