import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [provider, setProvider] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/health").then((res) => setProvider(res.data.provider)).catch(() => setProvider(null));
  }, []);

  return (
    <nav className="bg-[#161b22] border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3">
        <FaRobot className="text-3xl text-green-400" />
        <div>
          <h1 className="text-2xl font-bold">AI Code Reviewer</h1>
          <p className="text-gray-400 text-sm">Analyze • Optimize • Improve</p>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        <div className="bg-[#21262d] px-4 py-2 rounded-lg text-sm">
          MERN + {provider ? provider.toUpperCase() : "…"}
        </div>

        {user ? (
          <>
            <Link to="/history" className="text-sm text-gray-300 hover:text-white">History</Link>
            <span className="text-sm text-gray-400">Hi, {user.name}</span>
            <button onClick={() => { logout(); navigate("/"); }}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md transition">
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-300 hover:text-white">Log In</Link>
            <Link to="/register" className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;