import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Main",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    heading: "CRM",
    items: [
      { label: "Contacts",  to: "/contacts",  icon: <Users size={18} /> },
      { label: "Deals",     to: "/deals",     icon: <Briefcase size={18} /> },
      { label: "Projects",  to: "/projects",  icon: <Layers size={18} /> },
    ],
  },
  {
    heading: "Reports",
    items: [
      { label: "Analytics", to: "/analytics", icon: <BarChart3 size={18} /> },
      { label: "Documents", to: "/documents", icon: <FileText size={18} /> },
    ],
  },
  {
    heading: "System",
    items: [
      { label: "Settings",  to: "/settings",  icon: <Settings size={18} /> },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col bg-[#111318] border-r border-white/5
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-base tracking-wide whitespace-nowrap">
            PayMedia
          </span>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5 scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            {!collapsed && (
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                {group.heading}
              </p>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                       transition-all duration-150
                       ${
                         isActive
                           ? "bg-teal-500/15 text-teal-400"
                           : "text-gray-400 hover:bg-white/5 hover:text-white"
                       }`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="whitespace-nowrap">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="
          absolute -right-3 top-1/2 -translate-y-1/2
          w-6 h-6 rounded-full bg-[#1e2028] border border-white/10
          flex items-center justify-center text-gray-400
          hover:text-white hover:border-teal-500/50
          transition-all duration-150 z-10
        "
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
};

export default Sidebar;
