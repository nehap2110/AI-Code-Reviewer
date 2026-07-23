import { FaRobot } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-[#161b22] border-b border-gray-800 px-8 py-4 flex justify-between items-center">

      <div className="flex items-center gap-3">
        <FaRobot className="text-3xl text-green-400" />
        <div>
          <h1 className="text-2xl font-bold">AI Code Reviewer</h1>
          <p className="text-gray-400 text-sm">
            Analyze • Optimize • Improve
          </p>
        </div>
      </div>

      <div className="bg-[#21262d] px-4 py-2 rounded-lg">
        MERN + Gemini
      </div>

    </nav>
  );
}

export default Navbar;