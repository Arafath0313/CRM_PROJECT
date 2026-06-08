import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, AlertCircle, RefreshCw } from "lucide-react";
import { validateResetToken, resetPassword } from "../services/authService";
import { PasswordStrength } from "../components/PasswordStrength";
import { type PasswordStrengthLevel } from "../utils/passwordValidator";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [validating, setValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState<PasswordStrengthLevel>("Weak");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  // 1. Validate Token on Load
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setValidationError("Reset token is missing.");
        setIsValidToken(false);
        setValidating(false);
        return;
      }

      try {
        await validateResetToken(token);
        setIsValidToken(true);
      } catch (err: any) {
        setValidationError(
          err?.response?.data?.message ?? "The reset link is invalid or has expired."
        );
        setIsValidToken(false);
      } finally {
        setValidating(false);
      }
    };

    checkToken();
  }, [token]);

  // 2. Form submission handler
  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

    const errors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      errors.password = "Password is required.";
    } else if (strength !== "Good" && strength !== "Strong") {
      errors.password = "Password must be at least 'Good' (meets 4 or more criteria).";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!token) return;

    try {
      setSubmitting(true);
      await resetPassword({ token, newPassword: password });
      navigate("/reset-success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Failed to reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
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
              Create
              <br />
              New
              <br />
              Password
            </h1>
            <p className="mt-8 text-lg text-teal-100 max-w-sm leading-relaxed">
              Ensure your account security by selecting a robust, custom password that complies with our compliance rules.
            </p>
          </div>

          <div />
        </div>

        {/* ── Right details panel ── */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-10">
          <div className="w-full max-w-xl">

            {validating ? (
              // Loading State
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="animate-spin text-teal-600 mb-4" size={40} />
                <p className="text-gray-500 font-semibold text-base">Validating secure token...</p>
              </div>
            ) : !isValidToken ? (
              // Invalid/Expired Token Error UI
              <div className="py-8 text-center md:text-left">
                <div className="mx-auto md:mx-0 w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 border border-red-100">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Reset Link Expired or Invalid
                </h3>
                <p className="text-gray-500 mb-8 text-base leading-relaxed">
                  {validationError ?? "This password reset token has expired, been used, or is invalid. Reset links expire after 15 minutes for security."}
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-semibold text-base shadow-lg transition-colors"
                  >
                    Request New Reset Link
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-4 rounded-2xl font-semibold text-base transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              // Reset Password Form UI
              <div>
                <h2 className="text-4xl font-bold text-gray-900">
                  Create New Password
                </h2>
                <p className="text-gray-500 mt-2 mb-8 text-sm">
                  Your new password must be different from previous passwords.
                </p>

                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">
                    <AlertCircle size={17} className="shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      New Password
                    </label>
                    <div className={`flex items-center bg-gray-100 rounded-2xl px-5 py-4 transition-all duration-200 focus-within:bg-white focus-within:ring-2 ${fieldErrors.password ? "ring-2 ring-red-400" : "focus-within:ring-teal-500"}`}>
                      <Lock size={18} className="text-gray-400 shrink-0" />
                      <input
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
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Password Strength Component */}
                  <PasswordStrength
                    password={password}
                    onStrengthChange={setStrength}
                  />

                  {/* Confirm Password Field */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                      Confirm Password
                    </label>
                    <div className={`flex items-center bg-gray-100 rounded-2xl px-5 py-4 transition-all duration-200 focus-within:bg-white focus-within:ring-2 ${fieldErrors.confirmPassword ? "ring-2 ring-red-400" : "focus-within:ring-teal-500"}`}>
                      <Lock size={18} className="text-gray-400 shrink-0" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent outline-none ml-4 text-base text-gray-800 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle size={11} />
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-8 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Resetting Password..." : "Reset Password →"}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
