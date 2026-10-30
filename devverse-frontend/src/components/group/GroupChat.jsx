import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, Sparkles, MessageCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import useAuth from "../../store/AuthStore";
import { formatRelativeTime } from "../doubt/DoubtCard";

const GroupChat = ({ groupId, isMember }) => {
  const currentUser = useAuth((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollTimerRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const fetchMessages = async (isInitial = false) => {
    try {
      const data = await groupApi.getChatMessages(groupId, {
        page: 0,
        size: 50,
        sortBy: "createdAt",
        direction: "asc", // chronologically oldest to newest for chat
      });

      const list = data?.content || [];
      setMessages(list);

      if (isInitial) {
        setTimeout(() => scrollToBottom("auto"), 100);
      }
    } catch (err) {
      if (isInitial) {
        console.error("Chat history error:", err);
      }
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!groupId || !isMember) return;

    fetchMessages(true);

    // Live polling every 3.5 seconds
    pollTimerRef.current = setInterval(() => {
      fetchMessages(false);
    }, 3500);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [groupId, isMember]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || sending) return;

    setSending(true);
    setMessageText("");

    // Optimistic message
    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      groupId,
      senderId: currentUser?.id,
      senderUsername: currentUser?.actualUsername || currentUser?.username || "You",
      senderProfilePic: currentUser?.profilePic,
      content: text,
      isSender: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom("smooth"), 50);

    try {
      const savedMsg = await groupApi.sendChatMessage(groupId, {
        content: text,
      });

      // Replace optimistic message with actual
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? savedMsg : m))
      );
    } catch (err) {
      console.error("Send message error:", err);
      toast.error(err?.response?.data?.message || "Failed to send message");
      // Remove optimistic msg on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  if (!isMember) {
    return (
      <div className="bg-card border border-border/80 rounded-3xl p-10 text-center">
        <MessageCircle className="mx-auto text-muted-foreground mb-3" size={32} />
        <h3 className="font-bold text-lg text-foreground mb-1">
          Members-Only Chat
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Join this study group to participate in real-time developer discussions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#13141f] border border-[#25273b] rounded-2xl shadow-xl overflow-hidden flex flex-col h-[650px]">
      {/* Chat Sub-Header */}
      <div className="px-6 py-3.5 border-b border-white/5 flex items-center justify-between bg-[#141524]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h4 className="font-bold text-sm text-white">
            Live Chat Room
          </h4>
        </div>
        <span className="text-[11px] text-zinc-400">
          Auto-syncing
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 className="animate-spin text-[#7c3aed]" size={28} />
            <p className="text-xs text-zinc-400">
              Loading chat messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-400">
            <div className="w-12 h-12 rounded-2xl bg-[#7c3aed]/10 text-[#7c3aed] flex items-center justify-center mb-3">
              <Sparkles size={22} />
            </div>
            <p className="font-semibold text-sm text-white">
              Welcome to the chat!
            </p>
            <p className="text-xs max-w-xs mt-1 text-zinc-400">
              Say hello, share what problem you're tackling today, or ask for help.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe =
              msg.isSender ||
              msg.senderId === currentUser?.id ||
              msg.senderUsername === (currentUser?.actualUsername || currentUser?.username);

            const senderAvatar =
              msg.senderProfilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                msg.senderUsername || "User"
              )}&background=7c3aed&color=fff&bold=true`;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <img
                    src={senderAvatar}
                    alt={msg.senderUsername}
                    className="w-7 h-7 rounded-full object-cover border border-white/10 flex-shrink-0 mb-1"
                  />
                )}

                <div
                  className={`max-w-[75%] sm:max-w-[65%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? "bg-[#7c3aed] text-white rounded-br-none shadow-md shadow-[#7c3aed]/20"
                      : "bg-[#0c0d14] border border-[#26283d] text-zinc-200 rounded-bl-none"
                  }`}
                >
                  {!isMe && (
                    <div className="font-bold text-[11px] text-[#c084fc] mb-1">
                      @{msg.senderUsername}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <div
                    className={`text-[9px] mt-1.5 flex items-center justify-end gap-1 ${
                      isMe ? "text-purple-200" : "text-zinc-500"
                    }`}
                  >
                    <span>{formatRelativeTime(msg.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 border-t border-white/5 bg-[#0c0d14] flex items-center gap-2"
      >
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message here... (Press Enter to send)"
          className="flex-1 bg-[#141524] border border-[#26283d] focus:border-[#7c3aed] outline-none rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 transition-all"
        />
        <button
          type="submit"
          disabled={!messageText.trim() || sending}
          className="p-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-md shadow-[#7c3aed]/20 disabled:opacity-40 flex items-center justify-center flex-shrink-0 cursor-pointer"
        >
          {sending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
