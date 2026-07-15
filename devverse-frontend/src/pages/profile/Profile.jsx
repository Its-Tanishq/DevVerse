import React, { useState, useEffect } from "react";
import {
  Camera,
  AtSign,
  Mail,
  ChevronDown,
  Code,
  Trophy,
  Flame,
  Zap,
  Calendar,
  GitCommit,
  Sun,
  Type,
  Globe,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Loader2,
} from "lucide-react";
import useAuth from "@/store/AuthStore";
import { supabase } from "@/config/SupabaseClient";
import apiClient from "@/config/ApiClient";
import toast from "react-hot-toast";
import { getPasswordStrength, getStrengthColors } from "@/utils/passwordUtils";

const Profile = () => {
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [connectionUsername, setConnectionUsername] = useState("");

  const handleSaveConnection = async (platform) => {
    if (!connectionUsername.trim()) {
      toast.error(`Please enter a username for ${platform}`);
      return;
    }

    try {
      if (platform.toUpperCase() === "GITHUB") {
        try {
          const response = await fetch(`https://api.github.com/users/${connectionUsername.trim()}`);
          if (response.status === 404) {
            toast.error("GitHub username does not exist");
            return;
          }
          if (!response.ok) {
            toast.error("Failed to verify GitHub username");
            return;
          }
        } catch (err) {
          toast.error("Error connecting to GitHub. Please check your internet connection.");
          return;
        }
      }

      const currentConnections = user.connections || {};
      const updatedConnections = {
        ...currentConnections,
        [platform.toUpperCase()]: connectionUsername.trim(),
      };

      const res = await apiClient.patch("/profile/update-profile", {
        connections: updatedConnections,
      });

      if (res.data?.data) {
        updateUser(res.data.data);
      }

      toast.success(`${platform} connected successfully!`);
      setConnectingPlatform(null);
      setConnectionUsername("");
    } catch (error) {
      toast.error(`Failed to connect ${platform}`);
      console.log(error);
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      const currentConnections = user.connections || {};
      const updatedConnections = { ...currentConnections };
      delete updatedConnections[platform.toUpperCase()];

      const res = await apiClient.patch("/profile/update-profile", {
        connections: updatedConnections,
      });

      if (res.data?.data) {
        updateUser(res.data.data);
      }

      toast.success(`${platform} disconnected successfully!`);
    } catch (error) {
      toast.error(`Failed to disconnect ${platform}`);
    }
  };

  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    if (user) {
      if (user.profilePic != null) {
        setProfilePic(user.profilePic);
      } else {
        setProfilePic(null);
      }
      setUsername(user.actualUsername || user.username || "");
      setBio(user.bio || "");
    }
  }, [user]);

  useEffect(() => {
    setConnectionUsername("");
  }, [connectingPlatform]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // 1. File unique name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.actualUsername || user?.username || Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Upload photo in supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile_photos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 3. Generate public URL after upload
      const publicUrl =
        supabase.storage.from("profile_photos").getPublicUrl(filePath).data
          .publicUrl + `?t=${Date.now()}`;

      setProfilePic(publicUrl);
      // console.log("Image uploaded to supabase successful");
      handleSaveProfile(publicUrl);
    } catch (error) {
      console.error("Upload error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setLoading(true);
    try {
      if (profilePic) {
        try {
          const urlObj = new URL(profilePic);
          const pathParts = urlObj.pathname.split("/");
          const fileName = pathParts[pathParts.length - 1];

          if (fileName) {
            const { error } = await supabase.storage
              .from("profile_photos")
              .remove([fileName]);

            if (error) {
              console.error("Failed to delete from Supabase:", error);
            } else {
              // console.log("Successfully deleted from Supabase");
            }
          }
        } catch (e) {
          console.error("Error parsing profile picture URL:", e);
        }
      }

      setProfilePic(null);
      await handleSaveProfile(null);
    } catch (error) {
      console.error("Remove photo error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = useAuth((state) => state.updateUser);

  // 4. Save data in spring boot
  const handleSaveProfile = async (newProfilePic = profilePic) => {
    try {
      const res = await apiClient.patch("/profile/update-photo", {
        profilePic: newProfilePic,
      });
      updateUser({ profilePic: newProfilePic });
      toast.success("Profile updated successfully");
    } catch (error) {
      // console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during update profile";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const res = await apiClient.patch("/profile/update-profile", {
        username,
        bio,
      });
      if (res.data?.data) {
        updateUser(res.data.data);
      } else {
        updateUser({ actualUsername: username, bio });
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during update profile";
      toast.error(errorMessage);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    setIsChangingPassword(true);
    try {
      await apiClient.patch("/user/me/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while changing password";
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      await apiClient.delete("/profile");
      toast.success("Account deleted successfully");
      logout();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting account";
      toast.error(errorMessage);
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-[90vw] max-w-7xl mx-auto pt-8 pb-12">
        <div className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Manage your public profile, account details, and security
            preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Public Profile
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  This is how other developers see you on DevVerse
                </p>
              </div>

              <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row gap-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-accent overflow-hidden ring-4 ring-background shadow-sm border border-border flex items-center justify-center text-foreground relative">
                      {loading && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-sm">
                          <Loader2
                            size={32}
                            className="animate-spin text-[#7c3aed]"
                          />
                        </div>
                      )}
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={48} />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-[#7c3aed] text-white p-1.5 rounded-full hover:bg-[#6d28d9] transition-colors shadow-sm border-2 border-background">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col w-full gap-2">
                    <label
                      className={`w-full py-1.5 px-3 text-sm font-medium text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-lg transition-colors text-center block ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7c3aed]/20 cursor-pointer"}`}
                    >
                      {loading ? "Uploading..." : "Change photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </label>
                    <button
                      onClick={handleRemovePhoto}
                      disabled={loading || !profilePic}
                      className={`w-full py-1.5 px-3 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg transition-colors ${loading || !profilePic ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#7c3aed]">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <AtSign size={16} />
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground"
                      />
                    </div>
                    {username !== user.actualUsername && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={isUpdatingProfile}
                          className="flex items-center gap-2 py-1.5 px-3 text-xs font-medium text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors shadow-sm rounded-lg disabled:opacity-50"
                        >
                          {isUpdatingProfile ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : null}
                          Update Username
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#7c3aed]">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        defaultValue={user.email}
                        placeholder="Enter your email"
                        disabled
                        className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#7c3aed]">
                      Pronouns
                    </label>
                    <div className="relative">
                      <select className="w-full pl-3 pr-9 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground appearance-none">
                        <option>He / Him</option>
                        <option>She / Her</option>
                        <option>They / Them</option>
                        <option>Prefer not to say</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div>
                <h2 className="text-lg font-bold text-foreground">Bio</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Shown on your public profile and community posts
                </p>
              </div>
              <div className="mt-6">
                <textarea
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground resize-none"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {bio.length} / 160 characters
                  </span>
                  <div className="flex-1 max-w-[120px] h-1.5 bg-accent rounded-full ml-4 overflow-hidden">
                    <div
                      className="h-full bg-[#7c3aed] rounded-full"
                      style={{
                        width: `${Math.min((bio.length / 160) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {bio !== user.bio && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdatingProfile}
                      className="flex items-center gap-2 py-2 px-4 text-sm font-medium text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors shadow-sm rounded-xl disabled:opacity-50"
                    >
                      {isUpdatingProfile ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : null}
                      Save Bio
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Connected Accounts
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Link external accounts to enable OAuth login and auto-fill
                  your profile
                </p>
              </div>
              <div className="mt-6 space-y-4">
                {/* GitHub Connection */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-accent/30 border border-border rounded-xl gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-foreground text-background rounded-lg">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        GitHub
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.connections.GITHUB
                          ? `github.com/${user.connections.GITHUB}`
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {user?.connections.GITHUB ? (
                      <>
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          Connected
                        </span>
                        <button
                          className="px-4 py-1.5 text-xs font-medium text-red-500 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                          onClick={() => handleDisconnect("GITHUB")}
                        >
                          Disconnect
                        </button>
                      </>
                    ) : connectingPlatform === "GitHub" ? (
                      <div className="flex flex-col gap-2 items-end">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. torvalds"
                            className="w-40 px-3 py-1.5 text-xs bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-foreground"
                            value={connectionUsername}
                            onChange={(e) =>
                              setConnectionUsername(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setConnectingPlatform(null);
                              }
                            }}
                          />
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#7c3aed] rounded-lg hover:bg-[#6d28d9]"
                            onClick={() => handleSaveConnection("GitHub")}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent rounded-lg"
                            onClick={() => {
                              setConnectingPlatform(null);
                              setConnectionUsername("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground mr-auto">
                          Enter your GitHub profile username
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-muted-foreground">
                          Not connected
                        </span>
                        <button
                          className="px-4 py-1.5 text-xs font-medium text-[#7c3aed] bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setConnectingPlatform("GitHub")}
                        >
                          Connect
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* LinkedIn Connection */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-accent/30 border border-border rounded-xl gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#0A66C2] text-white rounded-lg">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        LinkedIn
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.connections.LINKEDIN
                          ? `linkedin.com/in/${user.connections.LINKEDIN}`
                          : "Not connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {user?.connections.LINKEDIN ? (
                      <>
                        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          Connected
                        </span>
                        <button
                          className="px-4 py-1.5 text-xs font-medium text-red-500 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                          onClick={() => handleDisconnect("LINKEDIN")}
                        >
                          Disconnect
                        </button>
                      </>
                    ) : connectingPlatform === "LinkedIn" ? (
                      <div className="flex flex-col gap-2 items-end">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="e.g. williamhgates"
                            className="w-40 px-3 py-1.5 text-xs bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-foreground"
                            value={connectionUsername}
                            onChange={(e) =>
                              setConnectionUsername(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Escape") {
                                setConnectingPlatform(null);
                              }
                            }}
                          />
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#7c3aed] rounded-lg hover:bg-[#6d28d9]"
                            onClick={() => handleSaveConnection("LinkedIn")}
                          >
                            Save
                          </button>
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent rounded-lg"
                            onClick={() => {
                              setConnectingPlatform(null);
                              setConnectionUsername("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground mr-auto">
                          Enter your LinkedIn profile username
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-medium text-muted-foreground">
                          Not connected
                        </span>
                        <button
                          className="px-4 py-1.5 text-xs font-medium text-[#7c3aed] bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setConnectingPlatform("LinkedIn")}
                        >
                          Connect
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Change Password
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a strong password you do not use elsewhere
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#7c3aed]">
                    Current password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      value={passwords.oldPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          oldPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, old: !prev.old }))}
                    >
                      {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#7c3aed]">
                    New password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[#7c3aed]">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-colors text-sm text-foreground"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 py-2">
                  {getStrengthColors(
                    getPasswordStrength(passwords.newPassword),
                  ).map((color, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${color}`}
                    ></div>
                  ))}
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors shadow-sm rounded-xl disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                  Update password
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <h2 className="text-base font-bold text-foreground mb-6">
                Profile Stats
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7c3aed]/10 text-[#7c3aed] rounded-full">
                    <Code size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">312</p>
                    <p className="text-xs text-muted-foreground">
                      Problems Solved
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 text-orange-500 rounded-full">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">#1,847</p>
                    <p className="text-xs text-muted-foreground">Global Rank</p>
                  </div>
                </div>

                <div className="col-span-2 border-t border-border"></div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
                    <Flame size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">47 days</p>
                    <p className="text-xs text-muted-foreground">
                      Current Streak
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-full">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">24,800</p>
                    <p className="text-xs text-muted-foreground">XP Points</p>
                  </div>
                </div>

                <div className="col-span-2 border-t border-border"></div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-full">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      14 joined
                    </p>
                    <p className="text-xs text-muted-foreground">Contests</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#7c3aed]/10 text-[#7c3aed] rounded-full">
                    <GitCommit size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">248</p>
                    <p className="text-xs text-muted-foreground">
                      Contributions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TODO: Enable Notification and Preference tab infuture */}

            {/* <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-foreground">
                  Preferences
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Customize your DevVerse experience
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/30 border border-border rounded-xl cursor-pointer hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Sun size={18} />
                    <span className="text-sm font-medium">Theme</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-sm font-medium">Light</span>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-accent/30 border border-border rounded-xl cursor-pointer hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Code size={18} />
                    <span className="text-sm font-medium">
                      Default language
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-sm font-medium">Python 3</span>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-accent/30 border border-border rounded-xl cursor-pointer hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Type size={18} />
                    <span className="text-sm font-medium">
                      Editor font size
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-sm font-medium">14px</span>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-accent/30 border border-border rounded-xl cursor-pointer hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Globe size={18} />
                    <span className="text-sm font-medium">Timezone</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="text-sm font-medium">
                      UTC+5:30 - India
                    </span>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-base font-bold text-foreground">
                  Notification Settings
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose what you hear about
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Contest reminders
                  </span>
                  <div className="w-10 h-5 bg-[#7c3aed] rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Battle challenges
                  </span>
                  <div className="w-10 h-5 bg-[#7c3aed] rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Weekly digest email
                  </span>
                  <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer shadow-inner border border-border">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    New followers
                  </span>
                  <div className="w-10 h-5 bg-[#7c3aed] rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Comment replies
                  </span>
                  <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer shadow-inner border border-border">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="bg-red-500/5 rounded-2xl border border-red-500/20 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-red-500/10">
                <h2 className="text-sm font-bold text-red-500">Danger Zone</h2>
              </div>

              <div className="bg-background/50 divide-y divide-red-500/10">
                {/* TODO: Make it in future */}
                {/* <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Export my data
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Download all your submissions, stats and profile data
                    </p>
                  </div>
                  <button className="px-4 py-1.5 text-xs font-medium text-[#7c3aed] bg-card border border-[#7c3aed]/20 rounded-lg hover:bg-accent transition-colors whitespace-nowrap">
                    Export
                  </button>
                </div> */}

                <div className="flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-sm font-bold text-red-500">
                      Delete account
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                    className="px-4 py-1.5 text-xs font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDeletingAccount && (
                      <Loader2 size={12} className="animate-spin" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
