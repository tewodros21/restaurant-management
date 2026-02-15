import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product.id)}
      className="group bg-white rounded-[2.2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      {/* 1. DOMINANT IMAGE AREA - Increased aspect ratio for height */}
      <div className="relative overflow-hidden aspect-[3/2.8]">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out" 
          onError={(e) => { e.target.src = "https://placehold.co/600x600?text=Delicious+Food"; }}
        />
        
        {/* Sleek Overlay Price */}
        <div className="absolute top-3 left-3">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 shadow-xl">
            <span className="text-white font-black text-xs tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Floating Add Button Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <Plus className="text-indigo-600" size={20} />
           </div>
        </div>
      </div>

      {/* 2. MINIMAL TEXT AREA - Condensed to maximize image space */}
      <div className="p-3 bg-white">
        <div className="flex flex-col gap-0.5">
          {/* Category - Very Small & Subtle */}
          <span className="text-indigo-500 text-[8px] font-black uppercase tracking-[0.2em] opacity-80">
            {product.category_name || "Specialty"}
          </span>
          
          {/* Product Name - Strong but Compact */}
          <h3 className="text-slate-800 font-bold leading-tight text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {/* Availability Indicator - Micro UI */}
          <div className="flex items-center gap-1 mt-1 opacity-60">
             <div className="w-1 h-1 rounded-full bg-emerald-500" />
             <span className="text-[9px] font-medium text-slate-400">Available</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}