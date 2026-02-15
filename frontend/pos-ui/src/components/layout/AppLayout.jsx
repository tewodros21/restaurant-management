import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    // Change background to a softer, modern off-white
    <div className="flex h-screen bg-[#F4F7FE] p-4 gap-4"> 
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        {/* The main content area now feels like a distinct layer */}
        <main className="flex-1 overflow-y-auto mt-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
