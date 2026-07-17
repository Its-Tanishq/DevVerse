import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users as UsersIcon, Search, MoreHorizontal, Loader2, Filter, 
  Shield, Star, Ban, Trash2, Eye, Activity, Code2, Calendar, 
  ArrowUpDown, ChevronDown, CheckCircle2, XCircle, Award
} from "lucide-react";
import apiClient from "../../config/ApiClient";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All"); // All, Admin, User
  const [premiumFilter, setPremiumFilter] = useState("All"); // All, Premium, Free
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Banned
  const [joinDateFilter, setJoinDateFilter] = useState("All"); // All, Recent
  
  // Sorting
  const [sortBy, setSortBy] = useState("Newest"); // Newest, Most Active, Rating

  // Actions Dropdown State (using Portal to avoid table cell clipping/z-index issues)
  const [dropdownState, setDropdownState] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownState(null);
      }
    }
    function handleScrollOrResize() {
      if (dropdownState) setDropdownState(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [dropdownState]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/user?page=0&size=50");
        
        const enrichedUsers = res.data.data.content.map((u, index) => ({
          ...u,
          id: u.id || u.ID || `user-${index}-${Date.now()}`,
          createdAt: u.createdAt || new Date().toISOString(),
          isPremium: u.isPremium || false,
          xpPoint: u.xpPoint || 0,
          lastActive: u.lastActive || new Date().toISOString(),
          isBanned: u.isEnabled === false
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

  const handleAction = (action, user) => {
    setDropdownState(null);
    const targetId = user.id || user.ID;
    const targetParam = user.actualUsername || user.username || targetId;
    if (action === 'view_profile' || action === 'view_submissions' || action === 'view_activity') {
      navigate(`/admin/users/${targetParam}`, { state: { user } });
      return;
    }
    if (action === 'toggle_premium') {
      setUsers(prev => prev.map(u => (u.id === targetId || u.ID === targetId) ? { ...u, isPremium: !u.isPremium } : u));
    } else if (action === 'change_role') {
      setUsers(prev => prev.map(u => (u.id === targetId || u.ID === targetId) ? { ...u, role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' } : u));
    } else if (action === 'toggle_ban') {
      setUsers(prev => prev.map(u => (u.id === targetId || u.ID === targetId) ? { ...u, isBanned: !u.isBanned, isEnabled: u.isBanned } : u));
    } else if (action === 'delete_account') {
      if (window.confirm(`Are you sure you want to delete @${user.actualUsername}?`)) {
        setUsers(prev => prev.filter(u => u.id !== targetId && u.ID !== targetId));
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.actualUsername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "All" || 
      (roleFilter === "Admin" && user.role === "ADMIN") || 
      (roleFilter === "User" && user.role === "USER");
      
    const matchesPremium = premiumFilter === "All" || 
      (premiumFilter === "Premium" && user.isPremium) || 
      (premiumFilter === "Free" && !user.isPremium);
      
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Active" && !user.isBanned) || 
      (statusFilter === "Banned" && user.isBanned);
      
      
    let matchesJoinDate = true;
    if (joinDateFilter === "Recent") {
      matchesJoinDate = new Date(user.createdAt) > new Date(Date.now() - 30 * 86400000); // Last 30 days
    }

    return matchesSearch && matchesRole && matchesPremium && matchesStatus && matchesJoinDate;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "Most Active") {
      return b.xpPoint - a.xpPoint;
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="bg-pink-50 dark:bg-pink-900/20 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-pink-100 dark:border-pink-800/30">
            <UsersIcon size={24} className="text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Users
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Complete oversight and management of platform users.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-card border border-border rounded-lg px-4 py-2 flex flex-col shadow-sm">
             <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Users</span>
             <span className="text-lg font-bold text-foreground">{users.length}</span>
           </div>
           <div className="bg-card border border-border rounded-lg px-4 py-2 flex flex-col shadow-sm">
             <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Premium</span>
             <span className="text-lg font-bold text-pink-600 dark:text-pink-400">{users.filter(u => u.isPremium).length}</span>
           </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-3 justify-between">
          <div className="flex items-center bg-card border border-border rounded-xl px-3 py-2.5 gap-2 flex-1 max-w-md shadow-sm transition-colors focus-within:ring-2 focus-within:ring-[#7c3aed]/20 focus-within:border-[#7c3aed]">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            {/* Sort Dropdown */}
            <div className="relative group flex items-center bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm text-sm">
              <ArrowUpDown size={16} className="text-muted-foreground mr-2" />
              <select 
                className="bg-transparent outline-none text-foreground appearance-none pr-6 cursor-pointer font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Newest">Sort: Newest</option>
                <option value="Most Active">Sort: Most Active</option>
              </select>
              <ChevronDown size={14} className="text-muted-foreground absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        <div className="flex flex-wrap gap-2 p-3 bg-accent/20 rounded-xl border border-border/50 items-center">
          <Filter size={16} className="text-muted-foreground ml-1 mr-2" />
          
          <select 
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none shadow-sm cursor-pointer"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          
          <select 
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none shadow-sm cursor-pointer"
            value={premiumFilter}
            onChange={(e) => setPremiumFilter(e.target.value)}
          >
            <option value="All">All Plans</option>
            <option value="Premium">Premium</option>
            <option value="Free">Free</option>
          </select>

          <select 
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none shadow-sm cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Banned">Banned</option>
          </select>
          
          <select 
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none shadow-sm cursor-pointer"
            value={joinDateFilter}
            onChange={(e) => setJoinDateFilter(e.target.value)}
          >
            <option value="All">Any Join Date</option>
            <option value="Recent">Last 30 Days</option>
          </select>
          
          {/* Clear Filters */}
          {(roleFilter !== "All" || premiumFilter !== "All" || statusFilter !== "All" || joinDateFilter !== "All") && (
            <button 
              onClick={() => {
                setRoleFilter("All");
                setPremiumFilter("All");
                setStatusFilter("All");
                setJoinDateFilter("All");
                setSearchQuery("");
              }}
              className="ml-auto text-xs font-medium text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 underline underline-offset-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm relative z-10"
      >
        <div className="overflow-x-auto pb-32"> {/* Extra padding bottom for dropdowns */}
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email & Join Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status & Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="animate-spin text-pink-500" />
                      <p className="text-muted-foreground text-sm font-medium">
                        Loading users database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-pink-50 dark:bg-pink-900/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-2">
                        <Search size={28} className="text-pink-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">No users found</h3>
                      <p className="text-muted-foreground text-sm max-w-sm">
                        We couldn't find any users matching your current filters. Try adjusting your search parameters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user, index) => (
                  <tr key={user.id || user.ID || index} className="border-b border-border hover:bg-accent/30 transition-colors group">
                    {/* User Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.actualUsername}
                              className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-transparent group-hover:ring-pink-500/20 transition-all"
                            />
                          ) : (
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm uppercase ring-2 ring-transparent group-hover:ring-purple-500/20 transition-all">
                              {user.actualUsername ? user.actualUsername[0] : "?"}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground text-sm">
                              {user.actualUsername}
                            </span>
                            {user.role === "ADMIN" && (
                              <Shield size={12} className="text-[#7c3aed]" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            @{user.actualUsername?.toLowerCase().replace(/\s/g, '')}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Email & Join Date */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">
                        {user.email}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                     
                    {/* Status & Plan */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        {user.isBanned ? (
                          <span className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1">
                            <Ban size={10} /> Banned
                          </span>
                        ) : (
                          <span className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        )}
                        
                        {user.isPremium ? (
                          <span className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase flex items-center gap-1">
                            <Star size={10} className="fill-amber-500" /> Premium
                          </span>
                        ) : (
                          <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                            Free Tier
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4">
                       <div className="space-y-1.5">
                         <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <Activity size={13} className="text-blue-500" /> XP: {user.xpPoint}
                         </div>
                       </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (dropdownState?.userId === user.id) {
                            setDropdownState(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownState({
                              userId: user.id,
                              user: user,
                              top: rect.bottom + 6,
                              left: rect.right - 224, // 224px equals w-56
                            });
                          }
                        }}
                        className={`p-2 rounded-xl transition-colors ${dropdownState?.userId === user.id ? 'bg-[#7c3aed]/10 text-[#7c3aed]' : 'hover:bg-accent text-muted-foreground hover:text-foreground border border-transparent hover:border-border'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Portal Dropdown Menu */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {dropdownState && (
            <motion.div
              ref={dropdownRef}
              key={`portal-dropdown-${dropdownState.userId}`}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'fixed',
                top: `${dropdownState.top}px`,
                left: `${Math.max(16, dropdownState.left)}px`,
                zIndex: 99999,
              }}
              className="w-56 rounded-xl bg-card border border-border shadow-2xl overflow-hidden divide-y divide-border"
            >
              <div className="py-1">
                <button onClick={() => handleAction('view_profile', dropdownState.user)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Eye size={15} className="text-blue-500" /> View full profile
                </button>
                <button onClick={() => handleAction('view_submissions', dropdownState.user)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Code2 size={15} className="text-emerald-500" /> View submissions
                </button>
                <button onClick={() => handleAction('view_activity', dropdownState.user)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Activity size={15} className="text-purple-500" /> View activity log
                </button>
              </div>
              <div className="py-1">
                <button onClick={() => handleAction('toggle_premium', dropdownState.user)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Star size={15} className="text-amber-500" /> 
                  {dropdownState.user.isPremium ? 'Remove Premium' : 'Make Premium'}
                </button>
                <button onClick={() => handleAction('change_role', dropdownState.user)} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent flex items-center gap-2.5 transition-colors">
                  <Shield size={15} className="text-indigo-500" /> 
                  {dropdownState.user.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                </button>
              </div>
              <div className="py-1">
                <button onClick={() => handleAction('toggle_ban', dropdownState.user)} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-accent flex items-center gap-2.5 transition-colors ${dropdownState.user.isBanned ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {dropdownState.user.isBanned ? <CheckCircle2 size={15} /> : <Ban size={15} />} 
                  {dropdownState.user.isBanned ? 'Unban User' : 'Ban User'}
                </button>
                <button onClick={() => handleAction('delete_account', dropdownState.user)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2.5 transition-colors">
                  <Trash2 size={15} /> Delete account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
