import { useState, useEffect } from "react";
import { Navigate, Outlet, NavLink, useLocation } from "react-router";
import useAuth from "../../store/AuthStore";
import apiClient from "../../config/ApiClient";
import {
  LayoutDashboard,
  // BarChart2,
  Users,
  Code,
  Building2,
  Tag,
  CalendarClock,
  // Settings,
  // Shield,
  // Activity,
  ChevronDown,
} from "lucide-react";

export default function Layout() {
  const isLoggedIn = useAuth((state) => state.authStatus);
  const user = useAuth((state) => state.user);
  const location = useLocation();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalCompanies: 0,
    totalTags: 0,
    totalDailyChallenges: 0
  });

  useEffect(() => {
    if (isLoggedIn && user?.role === "ADMIN") {
      apiClient.get("/admin/stats")
        .then(res => {
          if (res.data.success) {
            setStats(res.data.data);
          }
        })
        .catch(err => console.error("Failed to fetch admin stats", err));
    }
  }, [isLoggedIn, user]);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    return num?.toString() || "0";
  };

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" />;
  }

  const sections = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
        // Incomplete route commented out:
        // { name: "Analytics", path: "/admin/analytics", icon: BarChart2 },
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Users", path: "/admin/users", icon: Users, badge: formatNumber(stats.totalUsers), badgeBg: "bg-[#7c3aed]" },
        { name: "Problems", path: "/admin/problems", icon: Code, badge: formatNumber(stats.totalProblems), badgeBg: "bg-[#06b6d4]" },
        { name: "Companies", path: "/admin/companies", icon: Building2, badge: formatNumber(stats.totalCompanies), badgeBg: "bg-[#f59e0b]" },
        { name: "Tags", path: "/admin/tags", icon: Tag, badge: formatNumber(stats.totalTags), badgeBg: "bg-[#10b981]" },
        { name: "Daily Challenges", path: "/admin/daily-challenges", icon: CalendarClock, badge: formatNumber(stats.totalDailyChallenges), badgeBg: "bg-[#ef4444]" },
      ]
    },
    // Incomplete SYSTEM section commented out (Settings, Moderation, Activity Logs have no backend/pages)
    // {
    //   title: "SYSTEM",
    //   items: [
    //     { name: "Settings", path: "/admin/settings", icon: Settings },
    //     { name: "Moderation", path: "/admin/moderation", icon: Shield },
    //     { name: "Activity Logs", path: "/admin/activity-logs", icon: Activity },
    //   ]
    // }
  ];

  return (
    <div className="flex min-h-screen bg-[#111111] text-gray-200 font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] shrink-0 border-r border-white/5 flex flex-col bg-[#161616] h-screen fixed left-0 top-0 z-50">
        {/* Sidebar header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#7c3aed] text-white w-8 h-8 rounded flex items-center justify-center font-bold text-lg">
              D
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-white tracking-wide">
                DevVerse
              </span>
              <span className="text-[11px] text-gray-500 -mt-1 font-medium">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-1">
                {section.title}
              </span>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = item.end
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.end}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-[#7c3aed]/10 text-[#7c3aed]"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                      }`}
                    >
                      <item.icon
                        size={18}
                        className={isActive ? "text-[#7c3aed]" : "text-gray-500 group-hover:text-gray-400"}
                      />
                      <span>{item.name}</span>
                      {item.badge && (
                        <div className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${item.badgeBg}`}>
                          {item.badge}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
            <div className="bg-[#7c3aed] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
              {user?.actualUsername?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-white truncate">
                {user?.actualUsername || "Admin"}
              </span>
              <span className="text-[11px] text-gray-500 truncate">
                {user?.email || "admin@devverse.io"}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] bg-[#111111] min-h-screen">
        <div className="w-full mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
