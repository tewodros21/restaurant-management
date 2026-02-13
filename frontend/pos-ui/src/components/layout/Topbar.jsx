import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-4">
      {/* LEFT */}
      <h1 className="text-sm font-semibold text-gray-700">
        POS
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            className="pl-9 pr-3 py-1.5 text-sm border rounded-lg w-48"
            placeholder="Search"
          />
        </div>

        <Bell size={18} className="text-gray-500" />

        <img
          src="https://i.pravatar.cc/40"
          className="w-7 h-7 rounded-full"
        />
      </div>
    </header>
  );
}
