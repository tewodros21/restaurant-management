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
    <aside className="w-64 bg-white border-r flex flex-col">
      {/* BRAND */}
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-2xl font-bold text-orange-500">
          RestroETHIX
        </span>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" />
        <NavItem icon={ShoppingCart} label="POS" active />
        <NavItem icon={Table} label="Tables" />
        <NavItem icon={Users} label="Customers" />
        <NavItem icon={FileText} label="Reports" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      {/* USER */}
      <div className="border-t p-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-9 h-9 rounded-full"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold">Admin</p>
          <p className="text-xs text-gray-500">Manager</p>
        </div>
        <LogOut size={18} className="text-gray-400 cursor-pointer" />
      </div>
    </aside>
  );
}

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition
        ${
          active
            ? "bg-orange-500 text-white shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
