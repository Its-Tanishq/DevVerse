import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, User, Shield, Lock, AlertTriangle, Globe, RefreshCw, Code2, Trash2, Ban, Star, XCircle
} from "lucide-react";
import apiClient from "../../config/ApiClient";
import toast from "react-hot-toast";

import UserHeroHeader from "../../components/admin/user-profile/UserHeroHeader";
import UserOverviewTab from "../../components/admin/user-profile/UserOverviewTab";
import UserSubmissionsTab from "../../components/admin/user-profile/UserSubmissionsTab";
import UserSecurityTab from "../../components/admin/user-profile/UserSecurityTab";
import UserConnectionsTab from "../../components/admin/user-profile/UserConnectionsTab";
import SubmissionInspectModal from "../../components/admin/user-profile/SubmissionInspectModal";
import ActionReasonModal from "../../components/common/ActionReasonModal";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize with passed state if available for instant 0ms render
  const [user, setUser] = useState(location.state?.user || null);
  const [loading, setLoading] = useState(!location.state?.user);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  
  // Navigation tabs: 'overview' | 'submissions' | 'security' | 'connections'
  const [activeTab, setActiveTab] = useState("overview");

  // Code inspection modal state
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Action loaders
  const [actionLoading, setActionLoading] = useState(null);
  
  // Action Reason Modal State
  const [reasonModalState, setReasonModalState] = useState({
    isOpen: false,
    action: null // 'ban' | 'premium' | 'delete'
  });

  useEffect(() => {
    if (user) {
      const userId = user.id || user.ID;
      if (userId) fetchUserSubmissions(userId);
    }
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      if (!user) setLoading(true);
      let res;
      if (!isNaN(id)) {
        res = await apiClient.get(`/user/${id}`);
      } else {
        try {
          res = await apiClient.get(`/user/username/${id}`);
        } catch (usernameErr) {
          // Fallback if backend /username endpoint isn't deployed yet
          const allRes = await apiClient.get(`/user?page=0&size=1000`);
          const found = (allRes.data?.data?.content || []).find(
            u => u.actualUsername === id || u.username === id || String(u.id || u.ID) === id
          );
          if (found) {
            const fetchedUserId = found.id || found.ID;
            setUser(found);
            fetchUserSubmissions(fetchedUserId);
            setLoading(false);
            return;
          }
          throw usernameErr;
        }
      }
      if (res?.data?.data) {
        const fetchedUser = {
          ...res.data.data,
          id: res.data.data.id || res.data.data.ID || id
        };
        setUser(fetchedUser);
        fetchUserSubmissions(fetchedUser.id);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      if (!user) {
        toast.error("Could not load user details");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubmissions = async (targetUserId) => {
    const userId = targetUserId || user?.id || user?.ID || (!isNaN(id) ? id : null);
    if (!userId) return;
    try {
      setLoadingSubmissions(true);
      const res = await apiClient.get(`/problem/submission/user/${userId}`);
      if (res.data?.data) {
        setSubmissions(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user submissions:", err);
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Quick action handlers (triggers modal)
  const handleToggleBan = () => setReasonModalState({ isOpen: true, action: 'ban' });
  const handleTogglePremium = () => setReasonModalState({ isOpen: true, action: 'premium' });
  const handleDeleteAccount = () => setReasonModalState({ isOpen: true, action: 'delete' });
  const handleRevokeSessions = () => setReasonModalState({ isOpen: true, action: 'revoke' });

  // Actual API execution
  const executeAction = async (reason) => {
    const { action } = reasonModalState;
    setReasonModalState({ isOpen: false, action: null });
    setActionLoading(action);

    const targetId = user?.id || user?.ID || id;

    try {
      if (action === 'ban') {
        const newBannedState = !user.isBanned;
        await apiClient.patch(`/user/${targetId}/ban?reason=${encodeURIComponent(reason)}`);
        setUser(prev => ({ ...prev, isBanned: newBannedState, isEnabled: !newBannedState }));
        toast.success(newBannedState ? "User has been banned" : "User has been unbanned");
      } else if (action === 'premium') {
        const newPremiumState = !user.isPremium;
        await apiClient.patch(`/user/${targetId}/premium?reason=${encodeURIComponent(reason)}`);
        setUser(prev => ({ ...prev, isPremium: newPremiumState }));
        toast.success(newPremiumState ? "User upgraded to Premium" : "User downgraded to Free Tier");
      } else if (action === 'delete') {
        await apiClient.delete(`/user/${targetId}?reason=${encodeURIComponent(reason)}`);
        toast.success("Account deleted successfully");
        navigate("/admin/users");
      } else if (action === 'revoke') {
        await apiClient.delete(`/admin/user/${targetId}/sessions?reason=${encodeURIComponent(reason)}`);
        toast.success("All active sessions revoked successfully");
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateUser = async (updates) => {
    try {
      const res = await apiClient.patch(`/admin/user/${user?.id || user?.ID || id}/moderation`, updates);
      if (res.data?.data) {
        setUser(res.data.data);
        toast.success("User profile updated");
      }
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <RefreshCw size={36} className="animate-spin text-[#7c3aed] mb-4" />
        <p className="text-muted-foreground font-medium">Loading profile details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">User Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-6">The user you are trying to view does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-medium transition-colors shadow-sm"
        >
          <ArrowLeft size={18} /> Back to Users
        </button>
      </div>
    );
  }

  // Calculate stats from submissions
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(s => s.status === 'ACCEPTED' || s.status === 'Accepted').length;
  const acceptanceRate = totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : "0.0";

  const tabs = [
    { id: "overview", label: "Overview", icon: User, count: null },
    { id: "submissions", label: "Submissions", icon: Code2, count: totalSubmissions },
    { id: "security", label: "Security & Audit", icon: Shield, count: null },
    { id: "connections", label: "Connected Accounts", icon: Globe, count: user?.connections ? Object.keys(user.connections).length : 0 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Back navigation & Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Users Directory
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono bg-accent px-2.5 py-1 rounded-lg">
            ID: #{user.id || user.ID || id}
          </span>
        </div>
      </div>

      {/* Hero Header Card */}
      <UserHeroHeader
        user={user}
        id={id}
        onUpdateUser={handleUpdateUser}
      />

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-3 text-sm font-semibold flex items-center gap-2 rounded-t-xl transition-colors whitespace-nowrap ${
                isActive 
                  ? "text-[#7c3aed]" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? "bg-[#7c3aed]/10 text-[#7c3aed]" : "bg-accent text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="active-profile-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <UserOverviewTab
              key="overview"
              user={user}
              submissions={submissions}
              loadingSubmissions={loadingSubmissions}
              acceptedSubmissions={submissions.filter(s => s.status === 'ACCEPTED').length}
              totalSubmissions={submissions.length}
              acceptanceRate={submissions.length ? Math.round((submissions.filter(s => s.status === 'ACCEPTED').length / submissions.length) * 100) : 0}
              onTabChange={setActiveTab}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === "submissions" && (
            <UserSubmissionsTab
              key="submissions"
              submissions={submissions}
              loadingSubmissions={loadingSubmissions}
              onRefresh={() => fetchUserSubmissions(user.id || user.ID)}
              onSelectSubmission={setSelectedSubmission}
            />
          )}

          {activeTab === "security" && (
            <UserSecurityTab
              key="security"
              user={user}
              id={id}
              onToggleBan={handleToggleBan}
              onTogglePremium={handleTogglePremium}
              onDeleteAccount={handleDeleteAccount}
              onRevokeSessions={handleRevokeSessions}
            />
          )}

          {activeTab === "connections" && (
            <UserConnectionsTab
              key="connections"
              user={user}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Code Inspector Modal */}
      <SubmissionInspectModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />

      {/* Action Reason Modal */}
      {/* Action Reason Modal */}
      {(() => {
        if (!user || !reasonModalState.action) return null;
        const details = {
          delete: {
            title: "Delete Account",
            icon: <Trash2 size={24} className="text-red-500" />,
            colorClass: "bg-red-500/10 text-red-500",
            buttonColor: "bg-red-600 hover:bg-red-700 text-white",
            description: `You are about to permanently delete the account of @${user.actualUsername || user.username}. This action cannot be undone.`,
          },
          ban: {
            title: user.isBanned || user.isEnabled === false ? "Unban Account" : "Ban Account",
            icon: <Ban size={24} className="text-orange-500" />,
            colorClass: "bg-orange-500/10 text-orange-500",
            buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
            description: `You are about to ${user.isBanned || user.isEnabled === false ? 'unban' : 'ban'} the account of @${user.actualUsername || user.username}.`,
          },
          premium: {
            title: user.isPremium ? "Remove Premium Status" : "Grant Premium Status",
            icon: <Star size={24} className="text-indigo-500" />,
            colorClass: "bg-indigo-500/10 text-indigo-500",
            buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
            description: `You are about to ${user.isPremium ? 'remove premium from' : 'grant premium to'} the account of @${user.actualUsername || user.username}.`,
          },
          revoke: {
            title: "Revoke Active Sessions",
            icon: <XCircle size={24} className="text-orange-500" />,
            colorClass: "bg-orange-500/10 text-orange-500",
            buttonColor: "bg-orange-600 hover:bg-orange-700 text-white",
            description: `You are about to revoke all active sessions for @${user.actualUsername || user.username}. They will be logged out immediately from all devices.`,
          }
        }[reasonModalState.action];

        return (
          <ActionReasonModal 
            isOpen={reasonModalState.isOpen}
            onClose={() => setReasonModalState({ isOpen: false, action: null })}
            onConfirm={executeAction}
            title={details?.title}
            icon={details?.icon}
            description={details?.description}
            colorClass={details?.colorClass}
            buttonColor={details?.buttonColor}
            confirmText="Confirm Action"
          />
        );
      })()}
    </div>
  );
}
