import { useLocation, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";
import { forgotPassword } from "../services/authService";

const CheckInbox = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? "your email address";

  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setMessage(null);
    try {
      await forgotPassword(email);
      setMessage("Reset link resent successfully.");
    } catch (err) {
      setMessage("Failed to resend reset link. Please try again.");
    } finally {
      setResending(false);
    }
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
              Check
              <br />
              Your
              <br />
              Inbox
            </h1>
            <p className="mt-8 text-lg text-teal-100 max-w-sm leading-relaxed">
              We've dispatched a unique link to your mailbox. Please follow the instructions to reset your system password.
            </p>
          </div>

          <div />
        </div>

        {/* ── Right details panel ── */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-10">
          <div className="w-full max-w-xl text-center md:text-left">

            {/* Circular Mail Icon */}
            <div className="mx-auto md:mx-0 w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-8 border border-teal-100 shadow-sm animate-pulse">
              <Mail size={36} />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="text-gray-500 mt-3 mb-8 text-base leading-relaxed">
              We've sent a password reset link to <strong className="text-gray-900 font-semibold">{email}</strong>. Please check your inbox and spam folders.
            </p>

            {message && (
              <p className="text-sm font-semibold text-teal-600 mb-6 flex items-center justify-center md:justify-start gap-2">
                {message}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/")}
                className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-base shadow-lg"
              >
                Go to Sign In
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                className="flex items-center justify-center gap-2 text-sm text-teal-600 hover:text-teal-700 transition-colors py-2 font-semibold disabled:opacity-55"
              >
                <RefreshCw size={15} className={resending ? "animate-spin" : ""} />
                {resending ? "Resending..." : "Did not receive the email? Click to resend"}
              </button>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/forgot-password")}
              className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mt-8 group w-full md:w-auto"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Try another email address
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckInbox;
