import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Topbar({ title, onMenuClick }) {
  const [provider, setProvider] = useState(null);
  const { user, logout, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setProvider(res.data.provider))
      .catch(() => setProvider(null));
  }, []);

  const handleToggleTheme = () => {
    toggleTheme();
    // Persist the preference server-side too, so it follows the user across devices.
    // Silently ignore failures (e.g. guest users) — localStorage already covers this session.
    if (user) {
      const next = theme === "dark" ? "light" : "dark";
      updateProfile({ theme: next }).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text)] p-1"
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        <h1 className="font-display font-semibold text-lg truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-block text-xs px-3 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">
          {provider ? provider.toUpperCase() : "…"}
        </span>

        <button
          onClick={handleToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
          aria-label="Toggle theme"
          title="Toggle light/dark mode"
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>

        {user ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="hidden sm:flex items-center gap-2 text-sm bg-[var(--bg)] hover:bg-[var(--border)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors"
          >
            Log Out
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] px-2"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
