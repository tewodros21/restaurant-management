import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UtensilsCrossed, X } from "lucide-react";
import ProductCard from "./ProductCard";

const CATEGORIES = ["All", "Rice", "Beverages", "Pizza"];

export default function ProductGrid({ products = [], onAdd }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category_name === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  return (
    <div className="flex flex-col h-full bg-white">
      
      {/* 1. HEADER SECTION */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xl px-8 py-6 space-y-6 border-b border-slate-50">
        
        {/* Modern Search Bar 
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-100/50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-[1.5rem] transition-all outline-none text-slate-700 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          )}
        </div>*/}

        {/* Category Selection */}
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="relative px-8 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap overflow-hidden group"
            >
              {activeCategory === cat ? (
                <motion.div 
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-slate-900"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-50 group-hover:bg-slate-100 transition-colors" />
              )}
              <span className={`relative z-10 tracking-wide ${activeCategory === cat ? "text-white" : "text-slate-500"}`}>
                {cat}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. SCROLLABLE GRID AREA */}
      <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
        {filteredProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full py-20 text-slate-300"
          >
            <UtensilsCrossed size={64} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="text-lg font-bold">No dishes found</p>
            <p className="text-sm">Try changing your search or category</p>
          </motion.div>
        ) : (
          /* UPDATED GRID COLS: From 5 down to 4 for bigger cards */
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} onAdd={onAdd} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}