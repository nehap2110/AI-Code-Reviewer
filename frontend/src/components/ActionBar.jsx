import { FaSearch, FaBook, FaBug, FaBolt, FaVial, FaTrash } from "react-icons/fa";

export const ACTIONS = [
  { key: "review", label: "Review", icon: FaSearch, accent: "var(--accent-performance)" },
  { key: "explain", label: "Explain", icon: FaBook, accent: "var(--accent-practice)" },
  { key: "fixBugs", label: "Fix Bugs", icon: FaBug, accent: "var(--accent-bug)" },
  { key: "optimize", label: "Optimize", icon: FaBolt, accent: "var(--accent-security)" },
  { key: "generateTests", label: "Tests", icon: FaVial, accent: "var(--accent-test)" },
];

function ActionBar({ onAction, onClear, isLoading, activeAction }) {
  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {ACTIONS.map(({ key, label, icon: Icon, accent }) => {
          const isActive = activeAction === key && isLoading;
          return (
            <button
              key={key}
              onClick={() => onAction(key)}
              disabled={isLoading}
              style={{ background: isActive ? accent : undefined }}
              className={`flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed border ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--bg)] text-[var(--text)]"
              }`}
            >
              <Icon style={{ color: isActive ? "white" : accent }} />
              {label}
            </button>
          );
        })}
      </div>

      <button
        onClick={onClear}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg)] px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <FaTrash />
        Clear Editor
      </button>
    </div>
  );
}

export default ActionBar;
