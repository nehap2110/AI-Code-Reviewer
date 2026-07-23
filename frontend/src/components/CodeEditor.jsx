import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode ,language}) {
  return (
   <div className="rounded-xl overflow-hidden border border-gray-700 h-[75vh]">

      <Editor
        height="100%"
       language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 16,
          minimap: {
            enabled: false,
          },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;