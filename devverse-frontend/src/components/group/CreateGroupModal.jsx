import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  Lock,
  Globe,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";
import groupApi from "../../services/groupApi";
import { supabase } from "../../config/SupabaseClient";

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=200&auto=format&fit=crop&q=60",
];

const CreateGroupModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "PUBLIC",
    imageUrl: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        privacy: initialData.privacy || "PUBLIC",
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        privacy: "PUBLIC",
        imageUrl: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size must be under 3MB");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `group_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("group_avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // Fallback or retry with generic bucket if group_avatars bucket doesn't exist
        const { error: fallbackError } = await supabase.storage
          .from("profile_photos")
          .upload(fileName, file, { upsert: true });

        if (fallbackError) {
          throw uploadError;
        }

        const publicUrl = supabase.storage
          .from("profile_photos")
          .getPublicUrl(fileName).data.publicUrl;
        setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
        toast.success("Image uploaded!");
        return;
      }

      const publicUrl = supabase.storage
        .from("group_avatars")
        .getPublicUrl(fileName).data.publicUrl;
      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      toast.success("Image uploaded!");
    } catch (err) {
      console.warn("Storage upload note:", err);
      toast.error("Upload failed. You can paste an image URL instead.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      toast.error("Group name must be at least 3 characters");
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (isEditing) {
        result = await groupApi.updateGroup(initialData.id, formData);
        toast.success("Group updated successfully!");
      } else {
        result = await groupApi.createGroup(formData);
        toast.success("Study group created successfully!");
      }

      onSuccess && onSuccess(result);
      onClose();
    } catch (err) {
      console.error("Group save error:", err);
      const msg =
        err?.response?.data?.message ||
        "Failed to save group. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/20 mb-2">
            <Sparkles size={13} />
            {isEditing ? "Group Settings" : "New Community Circle"}
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Study Group" : "Create a Study Group"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {isEditing
              ? "Update your group information, cover image, and privacy settings."
              : "Bring developers together to solve problems, share insights, and study code."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Group Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. DSA Grind 2026, Fullstack Ninjas, Rust Explorers"
              maxLength={100}
              required
              className="w-full bg-accent/40 border border-border focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none rounded-xl px-4 py-2.5 text-sm text-foreground transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What is the mission, schedule, or focus of this study group?"
              rows={3}
              maxLength={1000}
              className="w-full bg-accent/40 border border-border focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none rounded-xl px-4 py-2.5 text-sm text-foreground transition-all resize-none"
            />
          </div>

          {/* Privacy Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Privacy Setting
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, privacy: "PUBLIC" })}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.privacy === "PUBLIC"
                    ? "border-[#7c3aed] bg-[#7c3aed]/10 text-foreground ring-1 ring-[#7c3aed]"
                    : "border-border hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    formData.privacy === "PUBLIC"
                      ? "bg-[#7c3aed] text-white"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  <Globe size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    Public Group
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    Anyone can browse and join freely.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, privacy: "PRIVATE" })}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  formData.privacy === "PRIVATE"
                    ? "border-[#7c3aed] bg-[#7c3aed]/10 text-foreground ring-1 ring-[#7c3aed]"
                    : "border-border hover:bg-accent/50 text-muted-foreground"
                }`}
              >
                <div
                  className={`p-2 rounded-xl mt-0.5 ${
                    formData.privacy === "PRIVATE"
                      ? "bg-[#7c3aed] text-white"
                      : "bg-accent text-muted-foreground"
                  }`}
                >
                  <Lock size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">
                    Private Group
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    Requires admin approval or invite code.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Group Image / Avatar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Group Avatar / Cover
            </label>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-2xl border border-border bg-accent overflow-hidden flex items-center justify-center flex-shrink-0">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Users className="text-muted-foreground" size={24} />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent hover:bg-accent/80 text-foreground border border-border transition-colors">
                    <Upload size={13} />
                    <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="Or paste an image URL here..."
                  className="w-full bg-accent/40 border border-border focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] outline-none rounded-xl px-3 py-1.5 text-xs text-foreground transition-all"
                />
              </div>
            </div>

            {/* Quick avatar presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground">Presets:</span>
              <div className="flex gap-2">
                {DEFAULT_AVATARS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, imageUrl: preset })
                    }
                    className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                      formData.imageUrl === preset
                        ? "border-[#7c3aed] scale-110 ring-2 ring-[#7c3aed]/50"
                        : "border-border hover:opacity-80"
                    }`}
                  >
                    <img
                      src={preset}
                      alt="Preset"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/80">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#7c3aed] hover:bg-[#6d28d9] text-white transition-all shadow-lg shadow-[#7c3aed]/25 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditing ? "Save Changes" : "Create Group"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
