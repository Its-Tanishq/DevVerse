import { Navigate, Outlet, NavLink, useLocation } from "react-router";
import useAuth from "../../store/AuthStore";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Building2,
  TerminalSquare,
  Shield,
  ChevronRight,
  CalendarClock,
  Zap,
} from "lucide-react";

export default function Layout() {
  const isLoggedIn = useAuth((state) => state.authStatus);
  const user = useAuth((state) => state.user);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true, color: "#7c3aed", bg: "bg-[#F2F1FE] dark:bg-[#7c3aed]/15" },
    { name: "Users", path: "/admin/users", icon: Users, color: "#ec4899", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { name: "Problems", path: "/admin/problems", icon: FolderOpen, color: "#06b6d4", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
    { name: "Companies", path: "/admin/companies", icon: Building2, color: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { name: "Test Cases", path: "/admin/testcases", icon: TerminalSquare, color: "#10b981", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { name: "Daily Challenges", path: "/admin/daily-challenges", icon: CalendarClock, color: "#8b5cf6", bg: "bg-violet-50 dark:bg-violet-900/20" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)]">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 border-r border-border hidden lg:flex flex-col bg-card/40 sticky top-[4.5rem] h-[calc(100vh-4.5rem)]">
        {/* Sidebar header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-[#7c3aed] text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-sm">
              <Shield size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-foreground tracking-tight">
                Admin Console
              </span>
              <span className="text-[11px] text-muted-foreground">
                DevVerse Management
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 mb-2">
          <div className="h-px bg-border" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((item, idx) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-[#7c3aed]/10 text-[#7c3aed] shadow-sm"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? "bg-[#F2F1FE] dark:bg-[#7c3aed]/20" : item.bg
                    }`}
                  >
                    <item.icon
                      size={16}
                      style={{ color: isActive ? "#7c3aed" : item.color }}
                    />
                  </div>
                  <span>{item.name}</span>
                  {isActive && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-[#7c3aed]/50"
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <div className="px-4 mb-2">
          <div className="h-px bg-border" />
        </div>

        {/* User Card */}
        <div className="p-4">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-[#7c3aed] text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                {user?.actualUsername?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">
                  {user?.actualUsername || "Admin"}
                </span>
                <div className="flex items-center gap-1">
                  <Zap size={10} className="text-[#7c3aed]" />
                  <span className="text-[11px] text-[#7c3aed] font-medium">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-border px-2 py-2 flex justify-around">
        {links.slice(0, 5).map((item) => {
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-[#7c3aed]"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 lg:pb-0">
        <div className="w-[90%] max-w-6xl mx-auto pt-8 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
