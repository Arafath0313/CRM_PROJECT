import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, ChevronDown, LogOut, User, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ─── Helper ───────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Component ────────────────────────────────────────────────────────────────

interface NavbarProps {
  pageTitle?: string;
}

const Navbar = ({ pageTitle = "Dashboard" }: NavbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock user — replace with decoded JWT / user API in future
  const user = { name: "Admin User", role: "Administrator" };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="h-16 px-6 bg-[#15171e] border-b border-white/5 flex items-center justify-between shrink-0">

      {/* Left — page title */}
      <div>
        <h1 className="text-white font-semibold text-lg">{pageTitle}</h1>
        <p className="text-gray-500 text-xs -mt-0.5">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Right — search + notifications + profile */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl px-3 py-2 text-sm text-gray-400 transition-colors cursor-pointer w-52">
          <Search size={15} />
          <span>Search…</span>
          <span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded-md">⌘K</span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-[#15171e]" />
        </button>

        {/* Profile dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-3 py-1.5 transition-all"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-white text-sm font-medium leading-none">{user.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{user.role}</p>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1e2028] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-white text-sm font-semibold">{user.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{user.role}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <User size={15} />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <Shield size={15} />
                  Security
                </button>
              </div>
              <div className="border-t border-white/5 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
