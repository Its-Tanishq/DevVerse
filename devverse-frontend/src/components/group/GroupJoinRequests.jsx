import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Check, X, Clock, Loader2, UserCheck, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import { formatRelativeTime } from "../doubt/DoubtCard";

const GroupJoinRequests = ({ groupId, onRequestHandled }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await groupApi.getPendingJoinRequests(groupId);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching join requests:", err);
      toast.error("Failed to load join requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchRequests();
    }
  }, [groupId]);

  const handleDecision = async (requestId, accept) => {
    setActionId(requestId);
    try {
      if (accept) {
        await groupApi.acceptJoinRequest(groupId, requestId);
        toast.success("Join request accepted!");
      } else {
        await groupApi.rejectJoinRequest(groupId, requestId);
        toast.success("Join request rejected");
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      onRequestHandled && onRequestHandled();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to process join request"
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div>
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <UserCheck size={20} className="text-amber-500" />
            Pending Join Requests ({requests.length})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review and approve developers asking to join your private circle.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <Loader2 className="animate-spin text-[#7c3aed]" size={28} />
          <p className="text-xs text-muted-foreground">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 rounded-2xl bg-accent/60 text-muted-foreground flex items-center justify-center mx-auto mb-3">
            <Inbox size={22} />
          </div>
          <p className="font-semibold text-sm text-foreground">
            No pending requests
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            When developers request access to this private group, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const isProcessing = actionId === req.id;
            const avatar =
              req.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                req.username || "User"
              )}&background=7c3aed&color=fff`;

            return (
              <div
                key={req.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-accent/30 border border-border/80"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={avatar}
                    alt={req.username}
                    className="w-10 h-10 rounded-2xl object-cover border border-border bg-accent flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/user/${req.username}`}
                        className="font-bold text-sm text-foreground hover:text-[#7c3aed] transition-colors"
                      >
                        @{req.username}
                      </Link>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock size={11} />
                        {formatRelativeTime(req.createdAt)}
                      </span>
                    </div>

                    {req.message ? (
                      <p className="text-xs text-foreground/90 mt-1 italic bg-background/50 px-2.5 py-1.5 rounded-xl border border-border/40 inline-block">
                        "{req.message}"
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        No message attached.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDecision(req.id, false)}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent hover:bg-red-500/10 text-muted-foreground hover:text-red-400 border border-border transition-colors disabled:opacity-50"
                  >
                    <X size={14} />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleDecision(req.id, true)}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GroupJoinRequests;
