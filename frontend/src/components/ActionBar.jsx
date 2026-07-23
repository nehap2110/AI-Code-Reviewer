import { FaPlay, FaTrash, FaUpload } from "react-icons/fa";

function ActionBar({ onReview, onClear }) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-5">
      <button
        onClick={onReview}
        className=" w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg transition"
      >
        <FaPlay />
        Review Code
      </button>

      <button
        onClick={onClear}
        className=" w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg transition"
      >
        <FaTrash />
        Clear
      </button>

      <label className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg cursor-pointer transition">
        <FaUpload />
        Upload File
        <input
          type="file"
          className="hidden"
          accept=".js,.cpp,.java,.py,.txt"
        />
      </label>
    </div>
  );
}

export default ActionBar;