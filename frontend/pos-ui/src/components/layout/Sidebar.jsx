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
    <aside className="w-20 lg:w-60 bg-white border-r flex flex-col">
      {/* BRAND */}
      <div className="h-16 flex items-center justify-center lg:justify-start px-4 border-b">
        <span className="text-lg font-bold text-orange-500 hidden lg:block">
          RestroETHIX
        </span>
        <span className="text-orange-500 font-bold lg:hidden">RE</span>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" />
        <NavItem icon={ShoppingCart} label="POS" active />
        <NavItem icon={Table} label="Tables" />
        <NavItem icon={Users} label="Customers" />
        <NavItem icon={FileText} label="Reports" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      {/* USER */}
      <div className="border-t p-3 flex justify-center lg:justify-between items-center">
        <img
          src="https://i.pravatar.cc/40"
          className="w-8 h-8 rounded-full"
        />
        <LogOut
          size={18}
          className="text-gray-400 cursor-pointer hidden lg:block"
        />
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
        ${
          active
            ? "bg-orange-500 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      <Icon size={18} />
      <span className="hidden lg:block text-sm font-medium">
        {label}
      </span>
    </div>
  );
}
