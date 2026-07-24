import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import ReviewPanel from "./components/ReviewPanel";
import ActionBar from "./components/ActionBar";
import api from "./services/api";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setProvider(res.data.provider))
      .catch(() => setProvider(null));
  }, []);

  const clearEditor = () => {
    setCode("");
    setReview("");
    setError("");
    setActiveAction(null);
  };

  const runAction = async (action) => {
    if (!code.trim()) {
      setError("Please write or paste some code first.");
      return;
    }

    setIsLoading(true);
    setActiveAction(action);
    setError("");

    try {
      const response = await api.post("/review", { code, language, action });
      setReview(response.data.review);
    } catch (err) {
      setError(err.response?.data?.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar provider={provider} />

      <div className="grid grid-cols-2 gap-6 p-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">💻 Code Editor</h2>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#21262d] px-3 py-2 rounded-lg border border-gray-700"
            >
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          <CodeEditor code={code} setCode={setCode} language={language} />

          <ActionBar
            onAction={runAction}
            onClear={clearEditor}
            isLoading={isLoading}
            activeAction={activeAction}
          />

          {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
        </div>

        <div className="bg-[#161b22] rounded-xl h-[82vh] flex flex-col">
          <div className="border-b border-gray-700 p-4">
            <h2 className="text-xl font-semibold">
              🤖 {isLoading ? "Thinking…" : "AI Review"}
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <ReviewPanel review={isLoading ? "" : review} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;