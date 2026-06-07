import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, RotateCcw, Lock } from "lucide-react";
import { verifyOtp } from "../services/authService";

const OTP_LENGTH = 6;

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = (location.state as any)?.email ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(OTP_LENGTH).fill(null)
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async () => {
    setError(null);
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    try {
      setLoading(true);
      await verifyOtp(otp);
      navigate("/success");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Invalid or expired code. Please try again."
      );
      setDigits(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendCooldown(60);
    setError(null);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  const otpFilled = digits.every((d) => d !== "");

  return (
    <div className="h-screen bg-[#1c1c1f] flex items-center justify-center p-4">

      {/* Outer container */}
      <div className="w-[90vw] h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
          <span className="text-gray-900 font-bold text-lg tracking-widest uppercase">
            PayMedia
          </span>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
            <Lock size={12} />
            <span className="uppercase tracking-widest">Secure Session</span>
          </div>
        </div>

        {/* Main content — vertically centered */}
        <div className="flex-1 flex items-center justify-center p-6">

          {/* Card */}
          <div className="bg-gray-50 rounded-3xl shadow-lg w-[500px] h-[550px] px-10 py-8 flex flex-col items-center justify-center">

            {/* Shield icon */}
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-6">
              <ShieldCheck size={34} className="text-teal-500" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Verify Your Identity
            </h1>
            <p className="text-gray-400 text-sm text-center mt-2 leading-relaxed max-w-xs">
              Enter the 6-digit verification code sent to your registered email
              address.
              {email && (
                <>
                  {" "}
                  Sent to{" "}
                  <span className="text-gray-700 font-semibold">{email}</span>
                </>
              )}
            </p>

            {/* Error */}
            {error && (
              <div className="w-full mt-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm text-center">
                {error}
              </div>
            )}

            {/* OTP Boxes */}
            <div className="flex items-center gap-3 mt-8">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={`
                    w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none
                    bg-white transition-all duration-150 select-none
                    ${
                      digit
                        ? "border-teal-500 text-gray-900 shadow-md shadow-teal-100"
                        : "border-gray-200 text-gray-900"
                    }
                    focus:border-teal-500 focus:shadow-md focus:shadow-teal-100
                  `}
                />
              ))}
            </div>

            {/* Authorize button */}
            <button
              id="otp-verify-btn"
              onClick={handleVerify}
              disabled={loading || !otpFilled}
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying…" : "Authorize Access"}
            </button>

            {/* Resend */}
            <div className="flex items-center justify-center gap-2 mt-5 text-sm text-gray-400">
              <span>Didn't receive a code?</span>
              {resendCooldown > 0 ? (
                <span className="text-gray-500 font-medium">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  Resend Code
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-300 text-[10px] font-semibold uppercase tracking-[0.2em]">
            <Lock size={10} />
            End-to-End Encrypted Verification
          </div>
        </div>

      </div>
    </div>
  );
};

export default OtpVerification;