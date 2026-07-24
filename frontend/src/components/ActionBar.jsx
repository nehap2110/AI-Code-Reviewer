import { FaSearch, FaBook, FaBug, FaBolt, FaVial, FaTrash, FaUpload } from "react-icons/fa";

const ACTIONS = [
  { key: "review", label: "Review", icon: FaSearch, color: "bg-green-600 hover:bg-green-700" },
  { key: "explain", label: "Explain", icon: FaBook, color: "bg-blue-600 hover:bg-blue-700" },
  { key: "fixBugs", label: "Fix Bugs", icon: FaBug, color: "bg-red-600 hover:bg-red-700" },
  { key: "optimize", label: "Optimize", icon: FaBolt, color: "bg-yellow-600 hover:bg-yellow-700" },
  { key: "generateTests", label: "Tests", icon: FaVial, color: "bg-purple-600 hover:bg-purple-700" },
];

function ActionBar({ onAction, onClear, isLoading, activeAction }) {
  return (
    <div className="mt-5 space-y-3">
      <div className="grid grid-cols-5 gap-3">
        {ACTIONS.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onAction(key)}
            disabled={isLoading}
            className={`flex flex-col items-center justify-center gap-1 ${color} px-3 py-3 rounded-lg transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              activeAction === key && isLoading ? "ring-2 ring-white" : ""
            }`}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onClear}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaTrash />
          Clear
        </button>

        {/* Upload wiring is a separate, currently-unimplemented feature — tracked, not touched here */}
        <label className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg cursor-pointer transition">
          <FaUpload />
          Upload File
          <input type="file" className="hidden" accept=".js,.cpp,.java,.py,.txt" />
        </label>
      </div>
    </div>
  );
}

export default ActionBar;