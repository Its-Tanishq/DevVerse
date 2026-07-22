import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";
import {
  Users,
  FolderOpen,
  Building2,
  TerminalSquare,
  ChevronRight,
  TrendingUp,
  Activity,
  CalendarClock,
  Zap,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const statCardsMeta = [
  {
    label: "Total Users",
    key: "totalUsers",
    icon: Users,
    color: "#ec4899",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    label: "Total Problems",
    key: "totalProblems",
    icon: FolderOpen,
    color: "#06b6d4",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    label: "Companies",
    key: "totalCompanies",
    icon: Building2,
    color: "#f59e0b",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
];

const quickLinks = [
  {
    title: "Manage Users",
    description: "View, edit, or remove registered users",
    path: "/admin/users",
    icon: Users,
    color: "#ec4899",
    bg: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    title: "Manage Problems",
    description: "Create, edit, and delete coding problems",
    path: "/admin/problems",
    icon: FolderOpen,
    color: "#06b6d4",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
  {
    title: "Manage Companies",
    description: "Add or remove company tags",
    path: "/admin/companies",
    icon: Building2,
    color: "#f59e0b",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    title: "Daily Challenges",
    description: "Schedule and manage daily challenges",
    path: "/admin/daily-challenges",
    icon: CalendarClock,
    color: "#8b5cf6",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
];

const systemMetrics = [
  { label: "API Uptime", value: "99.9%", color: "#10b981", pct: 99.9 },
  { label: "Avg Response", value: "124ms", color: "#7c3aed", pct: 88 },
  { label: "DB Usage", value: "42%", color: "#f59e0b", pct: 42 },
  { label: "Storage", value: "1.2 GB", color: "#06b6d4", pct: 24 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuth((state) => state.user);

  // Helper to format time ago
  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          apiClient.get("/admin/stats"),
          apiClient.get("/admin/activity")
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="inline-flex items-center gap-2 bg-[#F2F1FE] dark:bg-[#7c3aed]/15 rounded-full px-3 py-1 text-[13px] font-medium text-[#7c3aed]">
            <Zap size={12} />
            Admin Console
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mt-3">
          Welcome back, {user?.actualUsername || user?.username || "Admin"} <span className="text-2xl">👋</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Overview of your platform. Manage users, problems, and more.
        </p>
      </div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {statCardsMeta.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col relative overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-foreground">
                {loading ? (
                  <Loader2 size={24} className="animate-spin text-muted-foreground" />
                ) : (
                  stats?.[stat.key]?.toLocaleString() ?? "--"
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Quick Actions */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <motion.div
            className="flex flex-col gap-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-30px" }}
          >
            {quickLinks.map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <Link
                  to={item.path}
                  className="bg-card hover:bg-accent/50 border border-border rounded-2xl p-4 flex items-center justify-between transition-all duration-300 text-left group shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.bg}`}
                    >
                      <item.icon size={20} style={{ color: item.color }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-30px" }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 w-8 h-8 rounded-lg flex items-center justify-center">
                <Activity size={16} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                System Health
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {systemMetrics.map((metric) => (
                <div key={metric.label} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-medium">
                      {metric.label}
                    </span>
                    <span className="text-foreground font-bold">
                      {metric.value}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-accent/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${metric.pct}%`,
                        backgroundColor: metric.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-30px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-[#F2F1FE] dark:bg-[#7c3aed]/15 w-8 h-8 rounded-lg flex items-center justify-center">
                <TrendingUp size={16} className="text-[#7c3aed]" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                Recent Activity
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {activity.length === 0 && !loading && (
                <span className="text-sm text-muted-foreground">No recent activity found.</span>
              )}
              {activity.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="relative mt-0.5 shrink-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.colorDot || "#7c3aed" }}
                    ></div>
                    {idx !== activity.length - 1 && (
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-5 bg-border"></div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-foreground font-medium truncate">
                      {item.action}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
