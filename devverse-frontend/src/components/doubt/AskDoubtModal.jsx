import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  X,
  Plus,
  Loader2,
  Sparkles,
  Tag,
  HelpCircle,
  Eye,
  Edit3,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import apiClient from "../../config/ApiClient";
import useAuth from "../../store/AuthStore";

const SUGGESTED_TAGS = [
  "React",
  "Java",
  "Spring-Boot",
  "DSA",
  "JavaScript",
  "Python",
  "SQL",
  "System-Design",
  "CSS",
  "Docker",
  "TypeScript",
  "Node.js",
];

const AskDoubtModal = ({ isOpen, onClose, onDoubtCreated }) => {
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("write"); // "write" | "preview"
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTag = (tagToAdd) => {
    const cleanTag = tagToAdd.trim().replace(/^#/, "");
    if (!cleanTag) return;
    if (tags.length >= 5) {
      toast.error("You can add up to 5 tags");
      return;
    }
    if (tags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
      toast.error("Tag already added");
      return;
    }
    setTags([...tags, cleanTag]);
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please sign in to post a doubt");
      navigate("/signin");
      return;
    }

    if (!title.trim() || title.trim().length < 5) {
      toast.error("Title must be at least 5 characters long");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      toast.error("Please provide a detailed description (min 10 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        tags: tags.length > 0 ? tags : ["General"],
      };

      const res = await apiClient.post("/doubts", payload);
      toast.success("Doubt posted successfully!");

      const createdDoubt = res.data;
      if (onDoubtCreated) {
        onDoubtCreated(createdDoubt);
      }

      onClose();
      // Navigate to the newly created doubt
      if (createdDoubt?.id) {
        navigate(`/community/${createdDoubt.id}`);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to publish doubt. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-accent/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/15 text-[#7c3aed] flex items-center justify-center font-bold">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Ask a Doubt</h2>
              <p className="text-xs text-muted-foreground">
                Get help from the DevVerse community & mentors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to prevent re-renders when using Zustand in React?"
              className="w-full bg-background border border-border focus:border-[#7c3aed] rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-inner"
              maxLength={150}
            />
            <p className="text-[11px] text-muted-foreground">
              Be specific and imagine you are asking a question to another developer.
            </p>
          </div>

          {/* Description with Markdown Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                Description & Code <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 bg-accent/50 p-0.5 rounded-lg border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === "write"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Edit3 size={12} />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye size={12} />
                  Preview
                </button>
              </div>
            </div>

            {activeTab === "write" ? (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the problem you are facing, what you have tried, and include error logs or code snippets using ```language ... ```"
                  rows={8}
                  className="w-full bg-background border border-border focus:border-[#7c3aed] rounded-xl p-3.5 text-sm font-sans text-foreground placeholder:text-muted-foreground outline-none resize-y transition-all shadow-inner"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Markdown formatting & code blocks supported.</span>
                  <span>{description.length} chars</span>
                </div>
              </div>
            ) : (
              <div className="min-h-[190px] max-h-[250px] overflow-y-auto bg-background/50 border border-border rounded-xl p-4 text-sm text-foreground/90">
                {description ? (
                  <ReactMarkdown
                    components={{
                      h3: ({ node, ...props }) => (
                        <h3 className="text-base font-bold text-foreground mt-2 mb-1" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-2 leading-relaxed whitespace-pre-wrap" {...props} />
                      ),
                      code: ({ node, inline, className, children, ...props }) => {
                        return inline ? (
                          <code
                            className="bg-accent text-foreground px-1 py-0.5 rounded text-xs font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-neutral-900 text-neutral-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2 border border-border">
                            {children}
                          </pre>
                        );
                      },
                    }}
                  >
                    {description}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground italic">
                    Nothing to preview. Type something in the Write tab.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Tags <span className="text-[11px] font-normal lowercase">(up to 5)</span>
            </label>
            <div className="flex flex-wrap gap-2 items-center bg-background border border-border focus-within:border-[#7c3aed] rounded-xl p-2.5 transition-all">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/30 px-2.5 py-1 rounded-lg text-xs font-semibold"
                >
                  <Tag size={11} />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 transition-colors ml-0.5 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {tags.length < 5 && (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? "Type a tag and press Enter or comma..." : "Add more tags..."}
                  className="flex-1 min-w-[140px] bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground py-1"
                />
              )}
            </div>

            {/* Suggested tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-muted-foreground mr-1">Suggested:</span>
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
                .slice(0, 6)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-accent/60 text-muted-foreground hover:text-foreground hover:bg-accent border border-border/80 transition-colors cursor-pointer"
                  >
                    +{tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-xl text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 transition-all shadow-md shadow-[#7c3aed]/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publishing Doubt...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Publish Doubt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskDoubtModal;
