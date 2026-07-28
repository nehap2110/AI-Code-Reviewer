import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineCube } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]";

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-2xl w-full max-w-sm space-y-4"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--brand)] flex items-center justify-center">
            <HiOutlineCube className="text-white text-lg" />
          </div>
          <h2 className="text-xl font-display font-bold">Log in to CodeLens</h2>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClass}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
        <p className="text-sm text-[var(--text-muted)] text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-[var(--brand)] font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
