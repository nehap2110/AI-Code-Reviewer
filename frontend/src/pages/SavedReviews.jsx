import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaBookmark, FaPen, FaCheck } from "react-icons/fa";
import api from "../services/api";

function SavedReviews() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/saved")
      .then((res) => setItems(res.data.saved))
      .catch(() => toast.error("Could not load saved reviews"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/saved/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Removed from saved reviews");
    } catch {
      toast.error("Could not delete this saved review");
    }
  };

  const startRename = (item, e) => {
    e.stopPropagation();
    setEditingId(item._id);
    setDraftTitle(item.title || "");
  };

  const commitRename = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.patch(`/saved/${id}`, { title: draftTitle });
      setItems((prev) => prev.map((item) => (item._id === id ? res.data.item : item)));
      setEditingId(null);
      toast.success("Renamed");
    } catch {
      toast.error("Could not rename this review");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-[var(--text-muted)]">Loading saved reviews...</p>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-display font-bold mb-1">Saved Reviews</h2>
      <p className="text-[var(--text-muted)] mb-6 text-sm">
        Reviews you've manually bookmarked from the editor — separate from your full run history.
      </p>

      {items.length === 0 ? (
        <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl p-10 text-center text-[var(--text-muted)]">
          <FaBookmark className="mx-auto text-2xl mb-3 text-[var(--text-faint)]" />
          Nothing saved yet. Click "Save Review" on any result in the editor to keep it here.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/editor?savedId=${item._id}`)}
              className="bg-[var(--surface)] hover:border-[var(--brand)] border border-[var(--border)] p-4 rounded-xl flex justify-between items-center cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex-1">
                {editingId === item._id ? (
                  <input
                    autoFocus
                    value={draftTitle}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && commitRename(item._id, e)}
                    className="bg-[var(--bg)] border border-[var(--border)] rounded-md px-2 py-1 text-sm w-full max-w-xs"
                    placeholder="Untitled review"
                  />
                ) : (
                  <p className="font-medium truncate">{item.title || "Untitled review"}</p>
                )}
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {item.language} • {item.action} • {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {editingId === item._id ? (
                  <button
                    onClick={(e) => commitRename(item._id, e)}
                    className="text-[var(--accent-success)] hover:opacity-80 p-2"
                    aria-label="Confirm rename"
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <button
                    onClick={(e) => startRename(item, e)}
                    className="text-[var(--text-muted)] hover:text-[var(--text)] p-2"
                    aria-label="Rename"
                  >
                    <FaPen />
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(item._id, e)}
                  className="text-[var(--accent-bug)] hover:opacity-80 p-2"
                  aria-label="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedReviews;
