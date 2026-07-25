import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import { FaCopy, FaDownload } from "react-icons/fa";
import Loader from "./Loader";

function ReviewPanel({ review, isLoading, action }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Could not copy. Try selecting the text manually.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([review], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${action || "review"}-${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Downloaded as Markdown!");
  };

  return (
    <div className="bg-[#161b22] text-white h-full rounded-xl flex flex-col">
      {review && !isLoading && (
        <div className="flex justify-end gap-2 border-b border-gray-700 px-4 py-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition"
          >
            <FaCopy /> Copy
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition"
          >
            <FaDownload /> Download .md
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5">
        {isLoading ? (
          <Loader />
        ) : review ? (
          <ReactMarkdown>{review}</ReactMarkdown>
        ) : (
          <p className="text-gray-500 text-sm">
            Run an action from the left panel to see AI output here.
          </p>
        )}
      </div>
    </div>
  );
}

export default ReviewPanel;