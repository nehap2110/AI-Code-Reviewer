import { useState } from "react";
import toast from "react-hot-toast";
import { FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function SectionCard({ title, description, children }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 lg:p-6">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-[var(--text-muted)] mt-0.5 mb-4">{description}</p>}
      {!description && <div className="mt-4" />}
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]";

function Profile() {
  const { user, updateProfile, updatePassword } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [isSavingName, setIsSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setIsSavingName(true);
    try {
      await updateProfile({ name });
      toast.success("Name updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update name");
    } finally {
      setIsSavingName(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleThemeSelect = async (next) => {
    setTheme(next);
    try {
      await updateProfile({ theme: next });
    } catch {
      // theme still applied locally via localStorage; server sync can retry next visit
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-bold">Profile & Settings</h2>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          Manage your account details and preferences.
        </p>
      </div>

      <SectionCard title="Account">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-[var(--brand)] text-white flex items-center justify-center text-xl font-display font-bold shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{user.email}</p>
            {user.createdAt && (
              <p className="text-sm text-[var(--text-muted)]">
                Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleNameSubmit} className="space-y-3">
          <label className="block text-sm font-medium">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          <button
            type="submit"
            disabled={isSavingName || name === user.name}
            className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {isSavingName ? "Saving..." : "Save name"}
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Appearance" description="Choose how CodeLens looks on your screen.">
        <div className="flex gap-3">
          <button
            onClick={() => handleThemeSelect("light")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm transition-colors ${
              theme === "light"
                ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <FaSun /> Light
          </button>
          <button
            onClick={() => handleThemeSelect("dark")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm transition-colors ${
              theme === "dark"
                ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <FaMoon /> Dark
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Change password">
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              minLength={8}
              required
            />
            <p className="text-xs text-[var(--text-faint)] mt-1">At least 8 characters.</p>
          </div>
          <button
            type="submit"
            disabled={isSavingPassword}
            className="bg-[var(--brand)] hover:bg-[var(--brand-hover)] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {isSavingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

export default Profile;
