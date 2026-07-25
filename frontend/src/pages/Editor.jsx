import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import CodeEditor from "../components/CodeEditor";
import ReviewPanel from "../components/ReviewPanel";
import ActionBar, { ACTIONS } from "../components/ActionBar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ACTION_LABELS = Object.fromEntries(ACTIONS.map((a) => [a.key, a.label]));

function Editor() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const historyId = searchParams.get("historyId");

  useEffect(() => {
    if (!historyId) return;
    api.get(`/history/${historyId}`)
      .then((res) => {
        const item = res.data.item;
        setCode(item.code);
        setLanguage(item.language);
        setReview(item.result);
        setActiveAction(item.action);
      })
      .catch(() => toast.error("Could not load that saved review"));
  }, [historyId]);

  const clearEditor = () => {
    setCode("");
    setReview("");
    setActiveAction(null);
    setSearchParams({});
  };

  const runAction = async (action) => {
    if (!code.trim()) {
      toast.error("Please write or paste some code first.");
      return;
    }

    setIsLoading(true);
    setActiveAction(action);
    setSearchParams({});

    try {
      const response = await api.post("/review", { code, language, action });
      setReview(response.data.review);
      toast.success(
        `${ACTION_LABELS[action]} complete!${user ? "" : " Log in to save this to your history."}`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">💻 Code Editor</h2>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#21262d] px-3 py-2 rounded-lg border border-gray-700">
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>
        <CodeEditor code={code} setCode={setCode} language={language} />
        <ActionBar onAction={runAction} onClear={clearEditor} isLoading={isLoading} activeAction={activeAction} />
      </div>
      <div className="h-[82vh]">
        <ReviewPanel review={review} isLoading={isLoading} action={activeAction} />
      </div>
    </div>
  );
}

export default Editor;