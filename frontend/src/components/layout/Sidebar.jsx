import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCode,
  FaHistory,
  FaBookmark,
  FaUserCog,
  FaTimes,
} from "react-icons/fa";
import { HiOutlineCube } from "react-icons/hi2";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: FaHome, end: true },
  { to: "/editor", label: "Editor", icon: FaCode },
  { to: "/history", label: "History", icon: FaHistory },
  { to: "/saved", label: "Saved Reviews", icon: FaBookmark },
  { to: "/profile", label: "Profile", icon: FaUserCog },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-40
          bg-[var(--surface)] border-r border-[var(--border)] flex flex-col
          transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center shrink-0">
              <HiOutlineCube className="text-white text-lg" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">CodeLens</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text)] p-1"
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]"
                }`
              }
            >
              <Icon className="text-base shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--border)] text-xs text-[var(--text-faint)]">
          Analyze · Optimize · Improve
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
