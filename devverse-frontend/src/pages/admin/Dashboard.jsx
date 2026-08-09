import { useState } from "react";
import { Link } from "react-router";
import {
  Users,
  Code,
  Building2,
  Crown,
  TrendingUp,
  Settings,
  RefreshCw,
  Search,
  Download,
  Edit2,
  Trash2,
  Filter,
  Activity,
  CheckCircle2,
  Trophy,
  AlertCircle,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  // Hardcoding the exact visual representation as per the user's request
  const statCards = [
    {
      label: "Total Users",
      value: "24,582",
      change: "+12.5%",
      subtext: "Active this month: 18,293",
      icon: Users,
      color: "#7c3aed",
      bg: "bg-[#7c3aed]/10",
      changeColor: "text-emerald-500",
    },
    {
      label: "Total Problems",
      value: "2,648",
      change: "+8.2%",
      subtext: "Easy: 821 | Medium: 989 | Hard: 838",
      icon: Code,
      color: "#06b6d4",
      bg: "bg-[#06b6d4]/10",
      changeColor: "text-emerald-500",
    },
    {
      label: "Companies",
      value: "180",
      change: "+2.1%",
      subtext: "Premium partnerships: 45",
      icon: Building2,
      color: "#f59e0b",
      bg: "bg-[#f59e0b]/10",
      changeColor: "text-emerald-500",
    },
    {
      label: "Premium Subscribers",
      value: "4,291",
      change: "+18.7%",
      subtext: "Monthly recurring: $42.9K",
      icon: Crown,
      color: "#10b981",
      bg: "bg-[#10b981]/10",
      changeColor: "text-emerald-500",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Chen",
      action: "created an account",
      time: "2 min ago",
      icon: Users,
      color: "#7c3aed",
      bg: "bg-[#7c3aed]/10",
    },
    {
      id: 2,
      user: "Marcus Webb",
      action: "solved Hard problem #2198",
      time: "5 min ago",
      icon: CheckCircle2,
      color: "#10b981",
      bg: "bg-[#10b981]/10",
    },
    {
      id: 3,
      user: "Admin",
      action: "created contest: Weekly #45",
      time: "1 hour ago",
      icon: Trophy,
      color: "#f59e0b",
      bg: "bg-[#f59e0b]/10",
    },
    {
      id: 4,
      user: "Content Team",
      action: "added 3 new problems",
      time: "2 hours ago",
      icon: Code,
      color: "#06b6d4",
      bg: "bg-[#06b6d4]/10",
    },
    {
      id: 5,
      user: "Ethan Cole",
      action: "upgraded to Premium",
      time: "3 hours ago",
      icon: Crown,
      color: "#ef4444",
      bg: "bg-[#ef4444]/10",
    },
  ];

  const systemStats = [
    { label: "API Requests", sub: "in 24h", value: "2.3M", icon: Zap },
    { label: "Avg Response", sub: "performance", value: "145ms", icon: Activity },
    { label: "Error Rate", sub: "very low", value: "0.02%", icon: AlertCircle },
    { label: "Uptime", sub: "this month", value: "99.98%", icon: CheckCircle2 },
  ];

  const usersList = [
    { id: 1, name: "Ethan Cole", email: "ethan@devverse.io", joined: "2 months ago", level: "Gold", problems: 312, status: "Active", img: "https://i.pravatar.cc/150?u=ethan" },
    { id: 2, name: "Sarah Chen", email: "sarah@devverse.io", joined: "1 month ago", level: "Silver", problems: 187, status: "Active", img: "https://i.pravatar.cc/150?u=sarah" },
    { id: 3, name: "Marcus Webb", email: "marcus@devverse.io", joined: "3 weeks ago", level: "Bronze", problems: 95, status: "Active", img: "https://i.pravatar.cc/150?u=marcus" },
    { id: 4, name: "Priya Kapoor", email: "priya@devverse.io", joined: "5 days ago", level: "Free", problems: 23, status: "Suspended", img: "https://i.pravatar.cc/150?u=priya" },
    { id: 5, name: "James Wilson", email: "james@devverse.io", joined: "1 week ago", level: "Silver", problems: 156, status: "Active", img: "https://i.pravatar.cc/150?u=james" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">System overview and management</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
            <Filter size={14} />
            <span>Last 7 days</span>
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 rounded-lg transition-colors">
            <RefreshCw size={14} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 rounded-lg transition-colors">
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#161616] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <div className={`w-8 h-8 rounded flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-white">{stat.value}</span>
              <div className={`flex items-center gap-1 text-xs font-medium mb-1.5 ${stat.changeColor}`}>
                <TrendingUp size={12} />
                <span>{stat.change}</span>
              </div>
            </div>
            <span className="text-[11px] text-gray-500">{stat.subtext}</span>
          </div>
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#161616] border border-white/5 rounded-xl p-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-white">Recent Activity</h2>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </div>
          <div className="space-y-6">
            {recentActivity.map((item, idx) => (
              <div key={item.id} className="flex gap-4 relative">
                {idx !== recentActivity.length - 1 && (
                  <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-white/5" />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${item.bg}`}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <div className="flex flex-col pt-1">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white mr-1">{item.user}</span>
                    {item.action}
                  </p>
                  <span className="text-[11px] text-gray-500 mt-1">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Stats */}
        <div className="bg-[#161616] border border-white/5 rounded-xl p-6">
          <h2 className="text-base font-bold text-white mb-6">System Stats</h2>
          <div className="space-y-3">
            {systemStats.map((stat) => (
              <div key={stat.label} className="bg-[#111111] border border-white/5 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center border border-white/5">
                    <stat.icon size={14} className="text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-gray-300">{stat.label}</span>
                    <span className="text-[10px] text-gray-500">{stat.sub}</span>
                  </div>
                </div>
                <span className="text-lg font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Users Management</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="bg-[#111111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7c3aed]"
              />
            </div>
            <button className="flex items-center gap-2 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors">
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111111]/50 text-[10px] uppercase text-gray-500 font-semibold border-b border-white/5">
              <tr>
                <th className="px-5 py-3">USER</th>
                <th className="px-5 py-3">EMAIL</th>
                <th className="px-5 py-3">JOINED</th>
                <th className="px-5 py-3">LEVEL</th>
                <th className="px-5 py-3">PROBLEMS</th>
                <th className="px-5 py-3">STATUS</th>
                <th className="px-5 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-[13px]">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.img} alt={u.name} className="w-8 h-8 rounded-full border border-white/10" />
                      <span className="font-semibold text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{u.email}</td>
                  <td className="px-5 py-4 text-gray-400">{u.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.level === 'Gold' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                      u.level === 'Silver' ? 'bg-gray-400/10 text-gray-300' :
                      u.level === 'Bronze' ? 'bg-[#d97706]/10 text-[#d97706]' :
                      'bg-white/5 text-gray-400'
                    }`}>
                      {u.level}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold">{u.problems}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-7 h-7 rounded bg-[#111111] hover:bg-[#222] border border-white/10 flex items-center justify-center text-gray-400 transition-colors">
                        <Edit2 size={12} />
                      </button>
                      <button className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-500">Showing 1-5 of 24,582 users</span>
          <div className="flex items-center gap-1 text-xs">
            <button className="px-3 py-1.5 rounded bg-transparent hover:bg-white/5 text-gray-400 transition-colors border border-transparent hover:border-white/10 mr-1">
              &larr; Prev
            </button>
            <button className="w-7 h-7 rounded bg-[#7c3aed] text-white flex items-center justify-center font-medium">1</button>
            <button className="w-7 h-7 rounded hover:bg-white/5 text-gray-400 flex items-center justify-center font-medium transition-colors">2</button>
            <button className="w-7 h-7 rounded hover:bg-white/5 text-gray-400 flex items-center justify-center font-medium transition-colors">3</button>
            <button className="px-3 py-1.5 rounded bg-transparent hover:bg-white/5 text-gray-400 transition-colors border border-transparent hover:border-white/10 ml-1">
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
