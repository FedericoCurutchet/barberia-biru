import { Outlet } from "react-router";
import { Sidebar } from "../components/common/Sidebar";

export default function DashboardLayout() {
  return (
    <>
      <div className="flex max-h-screen overflow-x-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 max-h-screen overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </>
  );
}
