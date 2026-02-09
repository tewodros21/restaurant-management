import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* LEFT */}
      <div>
        <h1 className="text-lg font-semibold">
          Point of Sale
        </h1>
        <p className="text-xs text-gray-500">
          Manage orders & payments
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search…"
            className="pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <Bell size={18} className="text-gray-500 cursor-pointer" />

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
