import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const ResetSuccess = () => {
  const navigate = useNavigate();

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
              Password
              <br />
              Updated
            </h1>
            <p className="mt-8 text-lg text-teal-100 max-w-sm leading-relaxed">
              Your password has been successfully reset. You can now use your new credentials to log into the PayMedia CRM.
            </p>
          </div>

          <div />
        </div>

        {/* ── Right details panel ── */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-14 py-10">
          <div className="w-full max-w-xl text-center md:text-left">

            {/* Circular Check Icon */}
            <div className="mx-auto md:mx-0 w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100 shadow-sm">
              <CheckCircle2 size={38} />
            </div>

            <h2 className="text-4xl font-bold text-gray-900">
              Password reset successful
</h2>
            <p className="text-gray-500 mt-3 mb-8 text-base leading-relaxed">
              Your password has been updated. You can now access your account using your new credentials.
            </p>

            {/* Back to login */}
            <button
              onClick={() => navigate("/")}
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] transition-all duration-200 text-white py-4 rounded-2xl font-semibold text-base shadow-lg"
            >
              Sign In to Your Account
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetSuccess;
