import { Search, Bell, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent">
      {/* LEFT: Contextual Title */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Point of Sale
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Monday, 15 Feb 2026 • <span className="text-indigo-500">Main Hall</span>
        </p>
      </div>

      {/* RIGHT: Modern Actions */}
      <div className="flex items-center gap-6">
        {/* Modern Search Bar */}
        <div className="relative hidden lg:block group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
          />
          <input
            className="pl-12 pr-4 py-2.5 text-sm bg-slate-100 border-none rounded-2xl w-72 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-slate-600 placeholder:text-slate-400"
            placeholder="Search for dishes, orders..."
          />
        </div>

        {/* Action Icons with Soft Backgrounds */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-indigo-600 shadow-sm border border-slate-100 transition-all">
            <Bell size={20} />
          </button>
          <button className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-indigo-600 shadow-sm border border-slate-100 transition-all">
            <Settings size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
           <div className="text-right hidden sm:block">
             <p className="text-sm font-bold text-slate-700 leading-none">Alex Rivera</p>
             <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Manager</p>
           </div>
           <div className="relative">
             <img
               src="https://i.pravatar.cc/40"
               className="w-10 h-10 rounded-2xl object-cover shadow-md ring-2 ring-white"
             />
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
           </div>
        </div>
      </div>
    </header>
  );
}