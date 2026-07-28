import Editor from "@monaco-editor/react";
import { useTheme } from "../context/ThemeContext";

function CodeEditor({ code, setCode, language, onMount }) {
  const { theme } = useTheme();

  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border)] h-[60vh] lg:h-[65vh]">
      <Editor
        height="100%"
        language={language}
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={onMount}
        options={{
          fontSize: 15,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
          padding: { top: 12 },
        }}
      />
    </div>
  );
}

export default CodeEditor;
