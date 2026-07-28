import { useState } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { FaCopy, FaDownload, FaBookmark } from "react-icons/fa";
import Loader from "./Loader";
import api from "../services/api";

// Maps review section headings to a category color, turning the AI's plain
// markdown into a visually color-coded review (bugs=red, security=amber, etc.)
// This is the one deliberately distinctive touch in the UI — everything else stays quiet.
const SECTION_COLORS = [
  { match: /bug/i, color: "var(--accent-bug)" },
  { match: /security/i, color: "var(--accent-security)" },
  { match: /performance|complexity|bottleneck|optimiz/i, color: "var(--accent-performance)" },
  { match: /best practice|refactor/i, color: "var(--accent-practice)" },
  { match: /test/i, color: "var(--accent-test)" },
  { match: /score|verdict|strength/i, color: "var(--accent-success)" },
];

const colorForHeading = (text) => {
  const match = SECTION_COLORS.find((entry) => entry.match.test(text));
  return match?.color || "var(--text-faint)";
};

const markdownComponents = {
  h1: ({ children }) => {
    const text = String(children);
    return (
      <h1
        className="text-base font-display font-bold uppercase tracking-wide mt-6 mb-3 pl-3 border-l-[3px] first:mt-0"
        style={{ borderColor: colorForHeading(text), color: colorForHeading(text) }}
      >
        {children}
      </h1>
    );
  },
  code: ({ inline, className, children, ...props }) =>
    inline ? (
      <code className="bg-[var(--bg)] text-[var(--brand)] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className={`font-mono text-sm ${className || ""}`} {...props}>
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto my-3">
      {children}
    </pre>
  ),
};

function ReviewPanel({ review, isLoading, action, code, language, canSave }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Could not copy. Try selecting the text manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([review], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${action || "review"}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Downloaded as Markdown!");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post("/saved", { code, language, action, result: review });
      toast.success("Saved! Find it under Saved Reviews.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save this review");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] h-full rounded-xl flex flex-col">
      {review && !isLoading && (
        <div className="flex justify-end gap-2 border-b border-[var(--border)] px-4 py-2">
          {canSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 text-sm bg-[var(--brand-soft)] text-[var(--brand)] hover:opacity-80 px-3 py-1.5 rounded-md transition disabled:opacity-50"
            >
              <FaBookmark /> {isSaving ? "Saving..." : "Save Review"}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm bg-[var(--bg)] hover:bg-[var(--border)] px-3 py-1.5 rounded-md transition"
          >
            <FaCopy /> Copy
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm bg-[var(--bg)] hover:bg-[var(--border)] px-3 py-1.5 rounded-md transition"
          >
            <FaDownload /> Download .md
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5">
        {isLoading ? (
          <Loader />
        ) : review ? (
          <div className="animate-fade-in">
            <ReactMarkdown components={markdownComponents}>{review}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-[var(--text-muted)] text-sm">
            Run an action from the left panel to see AI output here.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReviewPanel;
