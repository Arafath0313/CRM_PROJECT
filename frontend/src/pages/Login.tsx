import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(email, password);

      // Extract token from response.data.token
      const token = response.data.token;

      // Persist token
      saveToken(token);

      // Navigate to protected dashboard
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="h-screen bg-[#1c1c1f] flex items-center justify-center p-4">
      <div className="w-[95vw] h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex">

        {/* ── Left panel ── */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white p-16 flex-col justify-between">
          <div>
            <span className="text-xl font-bold tracking-widest uppercase">
              PayMedia
            </span>
          </div>

          <div>
            <h1 className="text-7xl font-bold leading-tight">
              Unified
              <br />
              Management
              <br />
              Ecosystem
            </h1>
            <p className="mt-8 text-lg text-teal-100 max-w-md leading-relaxed">
              Verify your credentials to synchronize with current milestones.
              Your secure dashboard is optimized and ready for deployment.
            </p>
          </div>

          <div />
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-8 md:px-16">
          <div className="w-full max-w-xl">

            <h2 className="text-5xl font-bold text-center text-gray-900">
              Sign in
            </h2>
            <p className="text-center text-gray-500 mt-3 mb-10 text-base">
              Authenticated access required for system management
            </p>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="mb-5">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Email
              </label>
              <div className="flex items-center bg-gray-100 rounded-2xl px-5 py-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white">
                <Mail size={20} className="text-gray-400 shrink-0" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none ml-4 text-base text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="flex items-center bg-gray-100 rounded-2xl px-5 py-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-teal-500 focus-within:bg-white">
                <Lock size={20} className="text-gray-400 shrink-0" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none ml-4 text-base text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In…" : "Sign In →"}
            </button>

            <p className="text-center text-gray-400 mt-6 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
