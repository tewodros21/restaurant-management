import { motion } from "framer-motion";
import { Users, CheckCircle2 } from "lucide-react";

export default function TableSelector({
  tables = [],
  selectedTable,
  onSelectTable,
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end px-1">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Tables</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {tables.filter(t => !t.is_occupied).length} Available
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {tables.map((t) => {
          const isSelected = selectedTable === t.id;
          const isOccupied = t.is_occupied;

          return (
            <button
              key={t.id}
              onClick={() => onSelectTable(t.id)}
              className={`
                relative min-w-[110px] p-4 rounded-[1.5rem] 
                transition-all duration-300 flex flex-col items-center justify-center gap-1
                ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1"
                    : isOccupied
                    ? "bg-orange-50 text-orange-600 border-2 border-orange-100"
                    : "bg-white border-2 border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50"
                }
              `}
            >
              {/* Status Icon */}
              <div className={`mb-1 ${isSelected ? "text-white" : isOccupied ? "text-orange-500" : "text-slate-300"}`}>
                {isOccupied ? <Users size={16} /> : <CheckCircle2 size={16} />}
              </div>

              <span className="text-sm font-black tracking-tight">
                Table {t.number}
              </span>

              {/* Occupied / Available Badge */}
              <div className="h-4 flex items-center">
                {isOccupied ? (
                  <span className={`text-[9px] font-bold uppercase tracking-tighter ${isSelected ? "text-indigo-200" : "text-orange-400"}`}>
                    Occupied
                  </span>
                ) : (
                  <span className={`text-[9px] font-bold uppercase tracking-tighter ${isSelected ? "text-indigo-200" : "text-slate-300"}`}>
                    Available
                  </span>
                )}
              </div>

              {/* Active Indicator Dot */}
              {isSelected && (
                <motion.div 
                  layoutId="activeDot"
                  className="absolute -bottom-1 w-6 h-1 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}