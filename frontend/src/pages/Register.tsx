import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { register } from "../services/authService";
import { PasswordStrength } from "../components/PasswordStrength";
import { type PasswordStrengthLevel } from "../utils/passwordValidator";

// ─── Field component ───────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  error?: string;
}

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  icon,
  rightSlot,
  error,
}: InputFieldProps) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2"
    >
      {label}
    </label>
    <div
      className={`flex items-center bg-gray-100 rounded-2xl px-5 py-4 transition-all duration-200
        focus-within:bg-white focus-within:ring-2
        ${error ? "ring-2 ring-red-400" : "focus-within:ring-teal-500"}`}
    >
      <span className="text-gray-400 shrink-0">{icon}</span>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent outline-none ml-4 text-base text-gray-800 placeholder-gray-400"
      />
      {rightSlot}
    </div>
    {error && (
      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={11} />
        {error}
      </p>
    )}
  </div>
);

// ─── Validation ────────────────────────────────────────────────────────────

interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const validate = (
  fullName: string,
  mobileNumber: string,
  email: string,
  password: string,
  confirmPassword: string,
  passwordStrength: PasswordStrengthLevel
): FormErrors => {
  const errors: FormErrors = {};

  if (!fullName.trim()) errors.fullName = "Full name is required.";

  if (!mobileNumber.trim()) {
    errors.mobileNumber = "Mobile number is required.";
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(mobileNumber)) {
    errors.mobileNumber = "Enter a valid mobile number.";
  }

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (passwordStrength !== "Good" && passwordStrength !== "Strong") {
    errors.password = "Password must be at least 'Good' (meets 4 or more rules).";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

// ─── Page ──────────────────────────────────────────────────────────────────

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthLevel>("Weak");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const handleSubmit = async () => {
    setGlobalError(null);

    const errors = validate(fullName, mobileNumber, email, password, confirmPassword, passwordStrength);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);

      await register({ fullName, mobileNumber, email, password });

      // Navigate to OTP page, carry email so it can be shown to the user
      navigate("/verify-otp", { state: { email } });
    } catch (err: any) {
      setGlobalError(
        err?.response?.data?.message ?? "Registration failed. Please try again."
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
              Join the
              <br />
              PayMedia
              <br />
              Ecosystem
            </h1>
            <p className="mt-8 text-lg text-teal-100 max-w-sm leading-relaxed">
              Create your account to access the unified CRM platform. Manage
              contacts, deals, and projects from one place.
            </p>

            {/* Feature bullets */}
            <ul className="mt-8 space-y-3">
              {[
                "Role-based access control",
                "Real-time deal pipeline",
                "Secure JWT authentication",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-teal-100 text-sm">
                  <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div />
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-10">
          <div className="w-full max-w-xl">

            <h2 className="text-4xl font-bold text-center text-gray-900">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mt-2 mb-8 text-sm">
              Fill in your details to get started
            </p>

            {/* Global error */}
            {globalError && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">
                <AlertCircle size={17} className="shrink-0" />
                {globalError}
              </div>
            )}

            <div className="space-y-4">

              {/* Full Name */}
              <InputField
                id="reg-fullname"
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={setFullName}
                onKeyDown={handleKeyDown}
                icon={<User size={18} />}
                error={fieldErrors.fullName}
              />

              {/* Mobile Number */}
              <InputField
                id="reg-mobile"
                label="Mobile Number"
                type="tel"
                placeholder="+92 300 1234567"
                value={mobileNumber}
                onChange={setMobileNumber}
                onKeyDown={handleKeyDown}
                icon={<Phone size={18} />}
                error={fieldErrors.mobileNumber}
              />

              {/* Email */}
              <InputField
                id="reg-email"
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={setEmail}
                onKeyDown={handleKeyDown}
                icon={<Mail size={18} />}
                error={fieldErrors.email}
              />

              {/* Password */}
              <InputField
                id="reg-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={setPassword}
                onKeyDown={handleKeyDown}
                icon={<Lock size={18} />}
                error={fieldErrors.password}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Password Strength Indicator */}
              <PasswordStrength
                password={password}
                onStrengthChange={setPasswordStrength}
              />

              {/* Confirm Password */}
              <InputField
                id="reg-confirm"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                onKeyDown={handleKeyDown}
                icon={<Lock size={18} />}
                error={fieldErrors.confirmPassword}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>

            {/* Submit */}
            <button
              id="reg-submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-7 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account…" : "Create Account →"}
            </button>

            <p className="text-center text-gray-400 mt-5 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Sign In
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
