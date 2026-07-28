import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import CodeEditor from "../components/CodeEditor";
import ReviewPanel from "../components/ReviewPanel";
import ActionBar, { ACTIONS } from "../components/ActionBar";
import EditorToolbar from "../components/EditorToolbar";
import LanguageSelector from "../components/LanguageSelector";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ACTION_LABELS = Object.fromEntries(ACTIONS.map((a) => [a.key, a.label]));

function Editor() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [fileName, setFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const editorRef = useRef(null);

  const historyId = searchParams.get("historyId");
  const savedId = searchParams.get("savedId");

  useEffect(() => {
    if (historyId) {
      api
        .get(`/history/${historyId}`)
        .then((res) => {
          const item = res.data.item;
          setCode(item.code);
          setLanguage(item.language);
          setReview(item.result);
          setActiveAction(item.action);
          setFileName(null);
        })
        .catch(() => toast.error("Could not load that history item"));
    } else if (savedId) {
      api
        .get(`/saved/${savedId}`)
        .then((res) => {
          const item = res.data.item;
          setCode(item.code);
          setLanguage(item.language);
          setReview(item.result);
          setActiveAction(item.action);
          setFileName(null);
        })
        .catch(() => toast.error("Could not load that saved review"));
    }
  }, [historyId, savedId]);

  const clearEditor = () => {
    setCode("");
    setReview("");
    setActiveAction(null);
    setFileName(null);
    setSearchParams({});
  };

  const handleUpload = ({ code: newCode, language: newLanguage, fileName: newFileName }) => {
    setCode(newCode);
    setLanguage(newLanguage);
    setFileName(newFileName);
    setReview("");
    setActiveAction(null);
    setSearchParams({});
  };

  const handleFormat = () => {
    const action = editorRef.current?.getAction("editor.action.formatDocument");
    if (action) {
      action.run();
    } else {
      toast.error("Formatting isn't available for this language yet.");
    }
  };

  const runAction = async (action) => {
    if (!code.trim()) {
      toast.error("Please write, paste, or upload some code first.");
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
    <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <div>
        <div className="flex justify-between items-center mb-3 gap-3">
          <h2 className="text-lg font-display font-semibold">Code Editor</h2>
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <EditorToolbar
          code={code}
          language={language}
          fileName={fileName}
          onUpload={handleUpload}
          onFormat={handleFormat}
          disabled={isLoading}
        />

        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          onMount={(editor) => (editorRef.current = editor)}
        />
        <ActionBar onAction={runAction} onClear={clearEditor} isLoading={isLoading} activeAction={activeAction} />
      </div>

      <div className="h-[75vh] lg:h-[calc(65vh+7.5rem)]">
        <ReviewPanel
          review={review}
          isLoading={isLoading}
          action={activeAction}
          code={code}
          language={language}
          canSave={!!user}
        />
      </div>
    </div>
  );
}

export default Editor;
