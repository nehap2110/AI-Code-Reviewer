import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCode, FaHistory, FaBookmark, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ACTION_LABELS = {
  review: "Review",
  explain: "Explain",
  fixBugs: "Fix Bugs",
  optimize: "Optimize",
  generateTests: "Tests",
};

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ background: `${accent}22`, color: accent }}
      >
        <Icon />
      </div>
      <div>
        <p className="text-2xl font-display font-bold leading-none">{value}</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">{label}</p>
      </div>
    </div>
  );
}

function QuickAction({ to, title, description, icon: Icon }) {
  return (
    <Link
      to={to}
      className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex items-start gap-4 hover:border-[var(--brand)] transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-[var(--brand-soft)] text-[var(--brand)] flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">{description}</p>
      </div>
      <FaArrowRight className="text-[var(--text-faint)] group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
    </Link>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) return;
    api
      .get("/auth/stats")
      .then((res) => setStats(res.data.stats))
      .catch(() => {});
  }, [user]);

  const topLanguage = stats?.byLanguage
    ? Object.entries(stats.byLanguage).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;
  const topAction = stats?.byAction
    ? Object.entries(stats.byAction).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold">
          {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome to CodeLens"}
        </h2>
        <p className="text-[var(--text-muted)] mt-1">
          {user
            ? "Here's a snapshot of your recent code review activity."
            : "Paste or upload code and get an instant AI-powered review — no account required."}
        </p>
      </div>

      {user && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Reviews" value={stats?.totalReviews ?? "—"} icon={FaHistory} accent="var(--accent-performance)" />
          <StatCard label="Saved Reviews" value={stats?.totalSaved ?? "—"} icon={FaBookmark} accent="var(--accent-practice)" />
          <StatCard
            label="Top Language"
            value={topLanguage ? topLanguage.charAt(0).toUpperCase() + topLanguage.slice(1) : "—"}
            icon={FaCode}
            accent="var(--accent-security)"
          />
          <StatCard
            label="Most Used Action"
            value={topAction ? ACTION_LABELS[topAction] || topAction : "—"}
            icon={FaHistory}
            accent="var(--accent-success)"
          />
        </div>
      )}

      <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
        Quick Actions
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <QuickAction
          to="/editor"
          title="Start a new review"
          description="Paste code or upload a file for instant AI feedback"
          icon={FaCode}
        />
        <QuickAction
          to="/history"
          title="Browse your history"
          description="Revisit every review you've ever run"
          icon={FaHistory}
        />
        {user && (
          <QuickAction
            to="/saved"
            title="View saved reviews"
            description="Reviews you've bookmarked for later"
            icon={FaBookmark}
          />
        )}
        {!user && (
          <QuickAction
            to="/register"
            title="Create a free account"
            description="Save your review history and sync preferences across devices"
            icon={FaBookmark}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
