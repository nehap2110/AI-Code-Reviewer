import { useRef } from "react";
import toast from "react-hot-toast";
import { FaUpload, FaMagic, FaCopy, FaDownload, FaFileAlt } from "react-icons/fa";
import { ACCEPTED_EXTENSIONS, readCodeFile } from "../utils/fileHelpers";

const FILE_EXTENSION_BY_LANGUAGE = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  c: "c",
  ruby: "rb",
  go: "go",
  rust: "rs",
};

function EditorToolbar({ code, language, fileName, onUpload, onFormat, disabled }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    try {
      const result = await readCodeFile(file);
      onUpload(result);
      toast.success(`Loaded ${file.name} (${result.language})`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCopy = async () => {
    if (!code.trim()) {
      toast.error("Nothing to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch {
      toast.error("Could not copy. Try selecting the text manually.");
    }
  };

  const handleDownload = () => {
    if (!code.trim()) {
      toast.error("Nothing to download yet.");
      return;
    }
    const ext = FILE_EXTENSION_BY_LANGUAGE[language] || "txt";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `code.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {fileName && (
        <span className="flex items-center gap-1.5 text-xs bg-[var(--brand-soft)] text-[var(--brand)] px-2.5 py-1 rounded-full">
          <FaFileAlt /> {fileName}
        </span>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Upload a code file"
          className="flex items-center gap-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg)] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <FaUpload /> Upload
        </button>
        <button
          type="button"
          onClick={onFormat}
          disabled={disabled}
          title="Auto-format code"
          className="flex items-center gap-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg)] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <FaMagic /> Format
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={disabled}
          title="Copy code"
          className="flex items-center gap-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg)] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <FaCopy /> Copy
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={disabled}
          title="Download code"
          className="flex items-center gap-1.5 text-xs bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg)] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <FaDownload /> Download
        </button>
      </div>
    </div>
  );
}

export default EditorToolbar;
