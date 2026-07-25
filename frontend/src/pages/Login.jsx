import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleSubmit} className="bg-[#161b22] p-8 rounded-xl w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center">Log In</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full bg-[#21262d] border border-gray-700 rounded-lg px-4 py-2" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full bg-[#21262d] border border-gray-700 rounded-lg px-4 py-2" />
        <button type="submit" disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg transition disabled:opacity-50">
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
        <p className="text-sm text-gray-400 text-center">
          Don't have an account? <Link to="/register" className="text-green-400">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;