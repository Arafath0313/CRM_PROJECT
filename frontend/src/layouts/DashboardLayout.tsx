import { type ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle?: string;
}

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top navbar */}
        <Navbar pageTitle={pageTitle} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
