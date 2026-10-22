import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Loader2,
  Tag,
  X,
  Edit3,
  Eye,
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

const AskDoubt = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuth((state) => state.authStatus);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = (tagToAdd) => {
    const cleanTag = tagToAdd.trim().replace(/^#/, "");
    if (!cleanTag) return;
    if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
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
      toast.error("Please sign in to ask a doubt");
      navigate("/signin");
      return;
    }

    if (!title.trim() || title.trim().length < 5) {
      toast.error("Title must be at least 5 characters long");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      toast.error("Please provide a detailed description");
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
      toast.success("Doubt published successfully!");
      if (res.data?.id) {
        navigate(`/community/${res.data.id}`);
      } else {
        navigate("/community");
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
    <div className="w-[90vw] max-w-4xl mx-auto py-8 sm:py-10">
      <Link
        to="/community"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Doubt Forum
      </Link>

      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 text-[#7c3aed] flex items-center justify-center font-bold">
            <HelpCircle size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Ask a Public Doubt
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explain your issue clearly with code snippets to get the best responses.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Doubt Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How does React batch state updates in concurrent mode?"
              className="w-full bg-background border border-border focus:border-[#7c3aed] rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all shadow-inner"
              maxLength={150}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                Details & Code <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 bg-accent/50 p-0.5 rounded-lg border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
                  className={`flex items-center gap-1 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
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
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your question in detail. Use triple backticks (```) for code blocks."
                rows={10}
                className="w-full bg-background border border-border focus:border-[#7c3aed] rounded-xl p-4 text-sm font-sans text-foreground placeholder:text-muted-foreground outline-none resize-y transition-all shadow-inner"
              />
            ) : (
              <div className="min-h-[220px] max-h-[350px] overflow-y-auto bg-background/50 border border-border rounded-xl p-4 text-sm text-foreground/90">
                {description ? (
                  <ReactMarkdown
                    components={{
                      code: ({ node, inline, children, ...props }) =>
                        inline ? (
                          <code className="bg-accent px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-neutral-900 text-neutral-100 p-3 rounded-lg overflow-x-auto text-xs font-mono my-2 border border-border">
                            {children}
                          </pre>
                        ),
                    }}
                  >
                    {description}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground italic text-xs">
                    Nothing to preview.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tags <span className="text-xs font-normal lowercase">(up to 5 tags)</span>
            </label>
            <div className="flex flex-wrap gap-2 items-center bg-background border border-border focus-within:border-[#7c3aed] rounded-xl p-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 bg-[#7c3aed]/15 text-[#7c3aed] border border-[#7c3aed]/30 px-3 py-1 rounded-lg text-xs font-semibold"
                >
                  <Tag size={12} />
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
                  placeholder={tags.length === 0 ? "Type tag & press Enter..." : "Add tag..."}
                  className="flex-1 min-w-[150px] bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground py-1"
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-muted-foreground mr-1">Popular:</span>
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
                .slice(0, 6)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-accent/60 text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors cursor-pointer"
                  >
                    +{tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              to="/community"
              className="px-4 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white disabled:opacity-50 transition-all shadow-md shadow-[#7c3aed]/25 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Publishing...
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

export default AskDoubt;
