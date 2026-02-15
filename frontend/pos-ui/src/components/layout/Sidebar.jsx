import {
  LayoutDashboard,
  ShoppingCart,
  Table,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-20 lg:w-64 bg-[#1B1E2E] rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl transition-all duration-300">
      {/* BRAND - centered and cleaner */}
      <div className="h-24 flex items-center px-8">
        <span className="text-xl font-extrabold text-white tracking-tight hidden lg:block">
          FoodFlow <span className="text-indigo-500">POS</span>
        </span>
        <span className="text-indigo-500 font-black lg:hidden text-xl">F.</span>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" />
        <NavItem icon={ShoppingCart} label="Orders" active />
        <NavItem icon={Table} label="Tables" />
        <NavItem icon={Users} label="Customers" />
        <NavItem icon={FileText} label="Reports" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      {/* LOGOUT / USER */}
      <div className="p-6 mt-auto border-t border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/40" className="w-10 h-10 rounded-2xl border-2 border-slate-700" />
          <div className="hidden lg:block">
            <p className="text-xs text-slate-400">Admin</p>
            <p className="text-sm font-bold text-white leading-none">Alex R.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
        ${active 
          ? "bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)]" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span className="hidden lg:block text-[15px] font-semibold">
        {label}
      </span>
    </div>
  );
}

