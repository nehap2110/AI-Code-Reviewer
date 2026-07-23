import { useState } from "react";
import Navbar from "./components/Navbar";
import CodeEditor from "./components/CodeEditor";
import ReviewPanel from "./components/ReviewPanel";
import ActionBar from "./components/ActionBar";
import api from "./services/api";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("javascript");


  const clearEditor = () => {
  setCode("");
  setReview("");
   };

  const reviewCode = async () => {
    try {
      const response = await api.post("/review", {
        code,
      });

      setReview(response.data.review);
    } catch (error) {
      console.log(error);
      alert("Network Error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-2 gap-6 p-6">
        <div>


      <div className="flex justify-between items-center mb-3">
      <h2 className="text-xl font-semibold">
        💻 Code Editor
      </h2>

        <select
        value={language}
        onChange={(e)=>setLanguage(e.target.value)}
        className="bg-[#21262d] px-3 py-2 rounded-lg border border-gray-700"
      >
        <option value="javascript">JavaScript</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
       </select>
       </div>



          <CodeEditor code={code} setCode={setCode} language = {language} />

          <ActionBar
         onReview={reviewCode}
          onClear={clearEditor}
         />
        </div>

    <div className="bg-[#161b22] rounded-xl h-[82vh] flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <h2 className="text-xl font-semibold">
            🤖 AI Review
        </h2>
      </div>
       <div className="flex-1 overflow-y-auto p-5">
          <ReviewPanel review={review} />
       </div>
      </div>

      </div>
    </>
  );
}

export default App;