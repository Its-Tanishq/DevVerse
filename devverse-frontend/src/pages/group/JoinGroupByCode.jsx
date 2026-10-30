import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Sparkles, Loader2, KeyRound, AlertCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import useAuth from "../../store/AuthStore";

const JoinGroupByCode = () => {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(null);

  useEffect(() => {
    if (!inviteCode) {
      setError("No invite code provided.");
      setLoading(false);
      return;
    }

    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const joinGroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const group = await groupApi.joinByInviteCode(inviteCode.trim());
        setJoinedGroup(group);
        toast.success(`Welcome to ${group?.name || "the study circle"}!`);
        setTimeout(() => {
          if (group?.id) {
            navigate(`/groups/${group.id}`, { replace: true });
          }
        }, 1500);
      } catch (err) {
        console.error("Invite join error:", err);
        setError(
          err?.response?.data?.message ||
            "This invite code is invalid or has expired."
        );
      } finally {
        setLoading(false);
      }
    };

    joinGroup();
  }, [inviteCode, isLoggedIn]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#7c3aed]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        {loading ? (
          <div className="py-8 space-y-4">
            <Loader2 className="animate-spin text-[#7c3aed] mx-auto" size={40} />
            <h3 className="font-bold text-lg text-foreground">
              Joining Study Circle...
            </h3>
            <p className="text-xs text-muted-foreground">
              Verifying invite code <span className="font-mono font-bold text-foreground">{inviteCode}</span>
            </p>
          </div>
        ) : !isLoggedIn ? (
          <div className="py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center mx-auto mb-2">
              <KeyRound size={26} />
            </div>
            <h3 className="font-bold text-xl text-foreground">
              You've Been Invited!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Please sign in or create an account to accept this study circle invitation.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to={`/signin?redirect=/groups/join/${inviteCode}`}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-all"
              >
                Sign In to Join
              </Link>
              <Link
                to={`/signup?redirect=/groups/join/${inviteCode}`}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-accent text-foreground hover:bg-accent/80 border border-border transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : error ? (
          <div className="py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-2 border border-red-500/20">
              <AlertCircle size={26} />
            </div>
            <h3 className="font-bold text-xl text-foreground">
              Invitation Failed
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {error}
            </p>
            <div className="pt-2">
              <Link
                to="/community?tab=groups"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-all"
              >
                <span>Browse Community Groups</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
              <Sparkles size={26} />
            </div>
            <h3 className="font-bold text-xl text-foreground">
              You're in!
            </h3>
            <p className="text-xs text-muted-foreground">
              Redirecting you to <span className="font-bold text-foreground">{joinedGroup?.name}</span>...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinGroupByCode;
