import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users as UsersIcon, Search, MoreHorizontal, Loader2 } from "lucide-react";
import apiClient from "../../config/ApiClient";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/user?page=0&size=50");
        setUsers(res.data.data.content);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.actualUsername?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesRole = true;
    if (roleFilter === "Admin") {
      matchesRole = user.role === "ADMIN";
    } else if (roleFilter === "User") {
      matchesRole = user.role === "USER";
    }

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-pink-50 dark:bg-pink-900/20 w-10 h-10 rounded-lg flex items-center justify-center">
            <UsersIcon size={20} className="text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Manage Users
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              View and manage all registered users on the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 justify-between"
      >
        <div className="flex items-center bg-card border border-border rounded-xl px-3 py-2.5 gap-2 flex-1 max-w-md transition-colors focus-within:ring-2 focus-within:ring-[#7c3aed]/20 focus-within:border-[#7c3aed]">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-card border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors appearance-none pr-8"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account Status
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={32} className="animate-spin text-pink-500" />
                      <p className="text-muted-foreground text-sm font-medium mt-2">
                        Loading users...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-pink-50 dark:bg-pink-900/20 w-12 h-12 rounded-xl flex items-center justify-center mb-2">
                        <UsersIcon size={24} className="text-pink-500" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">
                        No users found matching your filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.actualUsername}
                            className="w-8 h-8 rounded-full object-cover shadow-sm"
                          />
                        ) : (
                          <div className="bg-[#7c3aed] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm uppercase">
                            {user.actualUsername ? user.actualUsername[0] : "?"}
                          </div>
                        )}
                        <span className="font-semibold text-foreground text-sm">
                          {user.actualUsername}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "ADMIN" ? (
                        <span className="bg-[#F2F1FE] dark:bg-[#7c3aed]/15 text-[#7c3aed] px-2.5 py-1 rounded-full text-xs font-medium">
                          Admin
                        </span>
                      ) : (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs font-medium">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isEnabled ? (
                        <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-full text-xs font-medium">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
