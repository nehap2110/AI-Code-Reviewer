import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaHistory } from "react-icons/fa";
import api from "../services/api";

function History() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/history")
      .then((res) => setItems(res.data.history))
      .catch(() => toast.error("Could not load history"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/history/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Could not delete item");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-[var(--text-muted)]">Loading history...</p>;
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-display font-bold mb-1">Review History</h2>
      <p className="text-[var(--text-muted)] mb-6 text-sm">
        Every review you've run, logged automatically.
      </p>

      {items.length === 0 ? (
        <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-xl p-10 text-center text-[var(--text-muted)]">
          <FaHistory className="mx-auto text-2xl mb-3 text-[var(--text-faint)]" />
          No history yet. Run an action while logged in and it'll show up here.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/editor?historyId=${item._id}`)}
              className="bg-[var(--surface)] hover:border-[var(--brand)] border border-[var(--border)] p-4 rounded-xl flex justify-between items-center cursor-pointer transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{item.preview}</p>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {item.language} • {item.action} • {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(item._id, e)}
                className="text-[var(--accent-bug)] hover:opacity-80 p-2 shrink-0"
                aria-label="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
