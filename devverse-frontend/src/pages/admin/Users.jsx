import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Download, Edit2, Trash2, UserPlus, User } from "lucide-react";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/user?page=0&size=50");
        const enrichedUsers = res.data.data.content.map((u, index) => ({
          ...u,
          id: u.id || u.ID || `user-${index}-${Date.now()}`,
        }));
        setUsers(enrichedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      user.actualUsername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Helper for time ago
  const timeAgo = (dateStr) => {
    if (!dateStr) return "Unknown";
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    const days = Math.floor(seconds / 86400);
    if (days > 30) return `${Math.floor(days / 30)} months ago`;
    if (days > 0) return `${days} days ago`;
    return "Today";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
      </div>

      {/* Users Management Table Container */}
      <div className="bg-[#161616] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5">
          <h2 className="text-base font-bold text-white">Users Management</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">Loading users...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const level = u.isPremium ? 'Gold' : 'Free';
                  const status = (u.isBanned || u.isEnabled === false) ? 'Suspended' : 'Active';
                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.profilePic ? (
                            <img src={u.profilePic} alt={u.actualUsername} className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-white/10 bg-[#111111] flex items-center justify-center">
                              <User size={14} className="text-gray-500" />
                            </div>
                          )}
                          <span className="font-semibold text-white">{u.actualUsername || u.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">{u.email}</td>
                      <td className="px-5 py-4 text-gray-400">{timeAgo(u.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          level === 'Gold' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                          'bg-white/5 text-gray-400'
                        }`}>
                          {level}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold">{u.xpPoint || 0}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/admin/users/${u.id || u.ID}`, { state: { user: u } })}
                            className="w-7 h-7 rounded bg-[#111111] hover:bg-[#222] border border-white/10 flex items-center justify-center text-gray-400 transition-colors"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button className="w-7 h-7 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-500 transition-colors">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-gray-500">Showing 1-{Math.min(50, filteredUsers.length)} of {users.length} users</span>
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
