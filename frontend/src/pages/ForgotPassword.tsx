import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      // Navigate to Check Inbox and pass the email state
      navigate("/check-inbox", { state: { email } });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#1c1c1f] flex items-center justify-center p-4">
      <div className="w-[95vw] min-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex">

        {/* ── Left branding panel ── */}
        <div className="hidden md:flex w-[42%] bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white p-16 flex-col justify-between shrink-0">
          <div>
            <span className="text-xl font-bold tracking-widest uppercase">
              PayMedia
            </span>
          </div>

          <div>
            <h1 className="text-6xl font-bold leading-tight">
              Reset
              <br />
              Your
              <br />
              Password
            </h1>
            <p className="mt-8 text-lg text-teal-100 max-w-sm leading-relaxed">
              We'll send you an email with a secure link to update your credentials and regain access to your dashboard.
            </p>
          </div>

          <div />
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-10">
          <div className="w-full max-w-xl">

            {/* Back Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Sign In
            </button>

            <h2 className="text-4xl font-bold text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-gray-500 mt-2 mb-8 text-sm">
              No worries, we'll send you reset instructions.
            </p>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">
                <AlertCircle size={17} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
                >
                  Email Address
                </label>
                <div className="flex items-center bg-gray-100 rounded-2xl px-5 py-4 transition-all duration-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500">
                  <Mail size={18} className="text-gray-400 shrink-0" />
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none ml-4 text-base text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending link..." : "Send Reset Link →"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
