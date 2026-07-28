import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { HiOutlineCube } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const message = apiErrors?.[0]?.message || err.response?.data?.message || "Registration failed";
      toast.error(message);
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
          <h2 className="text-xl font-display font-bold">Create your account</h2>
        </div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className={inputClass}
          />
          <p className="text-xs text-[var(--text-faint)] mt-1.5">
            At least 8 characters, with uppercase, lowercase, a number, and a special character.
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
        <p className="text-sm text-[var(--text-muted)] text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--brand)] font-medium">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
