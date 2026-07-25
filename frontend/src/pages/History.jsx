import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import api from "../services/api";

function History() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/history")
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

  if (isLoading) return <p className="text-center mt-10 text-gray-400">Loading history...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-5">Review History</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No saved reviews yet. Run an action while logged in to save one.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} onClick={() => navigate(`/?historyId=${item._id}`)}
              className="bg-[#161b22] hover:bg-[#1c2229] p-4 rounded-lg flex justify-between items-center cursor-pointer transition">
              <div>
                <p className="font-medium">{item.preview}</p>
                <p className="text-sm text-gray-500">
                  {item.language} • {item.action} • {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={(e) => handleDelete(item._id, e)} className="text-red-400 hover:text-red-300 p-2">
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