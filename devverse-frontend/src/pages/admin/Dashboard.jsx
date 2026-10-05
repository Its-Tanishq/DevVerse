import { useState, useEffect } from "react";
import { Link } from "react-router";
import apiClient from "../../config/ApiClient";
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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProblems: 0,
    totalCompanies: 0,
    totalTestCases: 0
  });
  const [growthData, setGrowthData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const timeAgo = (dateInput) => {
    const date = new Date(dateInput);
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const getActivityStyles = (log) => {
    switch(log.colorDot) {
      case 'blue': return { icon: Settings, color: '#3b82f6', bg: 'bg-blue-500/10' };
      case 'orange': return { icon: AlertCircle, color: '#f59e0b', bg: 'bg-orange-500/10' };
      case 'red': return { icon: Trash2, color: '#ef4444', bg: 'bg-red-500/10' };
      case 'green': return { icon: CheckCircle2, color: '#10b981', bg: 'bg-emerald-500/10' };
      default: return { icon: Activity, color: '#7c3aed', bg: 'bg-[#7c3aed]/10' };
    }
  };

  const fetchDashboardData = async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    
    try {
      const [statsRes, growthRes, activityRes, usersRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/stats/growth'),
        apiClient.get('/admin/activity'),
        apiClient.get('/user?page=0&size=5')
      ]);
      
      if (statsRes.data?.data) {
        setStats(statsRes.data.data);
      }
      
      if (growthRes.data?.data) {
        setGrowthData(growthRes.data.data);
      }

      if (activityRes.data?.data) {
        setRecentActivity(activityRes.data.data);
      }

      if (usersRes.data?.data?.content) {
        setUsersList(usersRes.data.data.content);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      subtext: "Total registered users",
      icon: Users,
      color: "#7c3aed",
      bg: "bg-[#7c3aed]/10",
    },
    {
      label: "Total Problems",
      value: stats.totalProblems.toLocaleString(),
      subtext: "Platform coding challenges",
      icon: Code,
      color: "#06b6d4",
      bg: "bg-[#06b6d4]/10",
    },
    {
      label: "Companies",
      value: stats.totalCompanies.toLocaleString(),
      subtext: "Premium partnerships",
      icon: Building2,
      color: "#f59e0b",
      bg: "bg-[#f59e0b]/10",
    },
    {
      label: "Test Cases",
      value: stats.totalTestCases.toLocaleString(),
      subtext: "Automated problem tests",
      icon: Crown,
      color: "#10b981",
      bg: "bg-[#10b981]/10",
    },
  ];



  const systemStats = [
    { label: "API Requests", sub: "in 24h", value: "2.3M", icon: Zap },
    { label: "Avg Response", sub: "performance", value: "145ms", icon: Activity },
    { label: "Error Rate", sub: "very low", value: "0.02%", icon: AlertCircle },
    { label: "Uptime", sub: "this month", value: "99.98%", icon: CheckCircle2 },
  ];



  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <RefreshCw size={36} className="animate-spin text-[#7c3aed] mb-4" />
        <p className="text-gray-400 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">System overview and management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#7c3aed]" : ""} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-gray-300 rounded-lg transition-colors">
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#161616] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <div className={`w-8 h-8 rounded flex items-center justify-center ${stat.bg}`}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
            </div>
            <div className="relative z-10 flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-white">
                {loading ? "..." : stat.value}
              </span>
            </div>
            <span className="relative z-10 text-[11px] text-gray-500">{stat.subtext}</span>
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
            {recentActivity.slice(0, 5).map((item, idx) => {
              const styles = getActivityStyles(item);
              const Icon = styles.icon;
              return (
                <div key={item.id} className="flex gap-4 relative">
                  {idx !== Math.min(recentActivity.length, 5) - 1 && (
                    <div className="absolute top-8 bottom-[-24px] left-[15px] w-px bg-white/5" />
                  )}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${styles.bg}`}>
                    <Icon size={14} style={{ color: styles.color }} />
                  </div>
                  <div className="flex flex-col pt-1">
                    <p className="text-sm text-gray-300">
                      {item.action}
                    </p>
                    <span className="text-[11px] text-gray-500 mt-1">{timeAgo(item.createdAt)}</span>
                  </div>
                </div>
              );
            })}
            
            {recentActivity.length === 0 && !loading && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
            )}
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
              {usersList.map((u) => {
                const isSuspended = u.isEnabled === false;
                const level = u.isPremium ? 'Premium' : 'Free';
                
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.profilePic || `https://ui-avatars.com/api/?name=${u.actualUsername || u.username}&background=random`} 
                          alt={u.actualUsername || u.username} 
                          className="w-8 h-8 rounded-full border border-white/10" 
                        />
                        <span className="font-semibold text-white">{u.actualUsername || u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{u.email}</td>
                    <td className="px-5 py-4 text-gray-400">{timeAgo(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        level === 'Premium' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                        'bg-white/5 text-gray-400'
                      }`}>
                        {level}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-500">-</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        !isSuspended ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {!isSuspended ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/user/${u.id}`} className="w-7 h-7 rounded bg-[#111111] hover:bg-[#222] border border-white/10 flex items-center justify-center text-gray-400 transition-colors">
                          <Edit2 size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-500">Showing {usersList.length} of {stats.totalUsers.toLocaleString()} users</span>
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
