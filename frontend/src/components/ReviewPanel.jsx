import ReactMarkdown from "react-markdown";

function ReviewPanel({ review }) {
  return (
    <div
      style={{
        background: "#161b22",
        color: "white",
        height: "80vh",
        overflowY: "auto",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <ReactMarkdown>{review}</ReactMarkdown>
    </div>
  );
}

export default ReviewPanel;