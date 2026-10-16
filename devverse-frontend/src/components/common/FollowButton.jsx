import React, { useState, useEffect } from "react";
import { UserPlus, UserCheck, UserMinus, Loader2 } from "lucide-react";
import apiClient from "@/config/ApiClient";
import useAuth from "@/store/AuthStore";
import toast from "react-hot-toast";

export default function FollowButton({
  targetUsername,
  initialIsFollowing = null,
  onFollowChange,
  size = "sm",
  className = "",
}) {
  const { authStatus, user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing ?? false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentUsername = user?.actualUsername || user?.username;
  const isSelf = currentUsername && targetUsername && (currentUsername.toLowerCase() === targetUsername.toLowerCase());

  // Sync initialIsFollowing if prop updates
  useEffect(() => {
    if (initialIsFollowing !== null && initialIsFollowing !== undefined) {
      setIsFollowing(initialIsFollowing);
    }
  }, [initialIsFollowing]);

  // If status is not provided, fetch it when authenticated
  useEffect(() => {
    let isMounted = true;

    if (initialIsFollowing === null && authStatus && targetUsername && !isSelf) {
      apiClient
        .get(`/follow/${targetUsername}/status`)
        .then((res) => {
          if (isMounted) setIsFollowing(Boolean(res.data?.data));
        })
        .catch((err) => {
          console.error("Failed to check follow status:", err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [targetUsername, authStatus, isSelf, initialIsFollowing]);

  // Don't display button for user themselves
  if (isSelf || !targetUsername) {
    return null;
  }

  const handleToggleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authStatus) {
      toast.error("Please sign in to follow users");
      return;
    }

    setLoading(true);
    const nextState = !isFollowing;

    try {
      if (isFollowing) {
        await apiClient.delete(`/follow/${targetUsername}`);
        setIsFollowing(false);
        toast.success(`Unfollowed @${targetUsername}`);
        if (onFollowChange) onFollowChange(false);
      } else {
        await apiClient.post(`/follow/${targetUsername}`);
        setIsFollowing(true);
        toast.success(`Following @${targetUsername}`);
        if (onFollowChange) onFollowChange(true);
      }
    } catch (err) {
      const message = err?.response?.data?.message || (nextState ? "Failed to follow user" : "Failed to unfollow user");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Size styling variants
  const sizeClasses = {
    xs: "px-2.5 py-1 text-xs gap-1 rounded-lg",
    sm: "px-3.5 py-1.5 text-xs font-semibold gap-1.5 rounded-xl",
    md: "px-4 py-2 text-sm font-semibold gap-2 rounded-xl",
  }[size] || "px-3.5 py-1.5 text-xs font-semibold gap-1.5 rounded-xl";

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none ${sizeClasses} ${
        isFollowing
          ? isHovered
            ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20"
            : "bg-accent/60 text-foreground border border-border hover:bg-accent"
          : "bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-sm hover:shadow"
      } ${className}`}
    >
      {loading ? (
        <>
          <Loader2 size={size === "xs" ? 12 : 14} className="animate-spin" />
          <span>Updating...</span>
        </>
      ) : isFollowing ? (
        isHovered ? (
          <>
            <UserMinus size={size === "xs" ? 12 : 14} />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserCheck size={size === "xs" ? 12 : 14} className="text-[#7c3aed]" />
            <span>Following</span>
          </>
        )
      ) : (
        <>
          <UserPlus size={size === "xs" ? 12 : 14} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}
