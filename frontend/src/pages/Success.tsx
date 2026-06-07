import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";

const REDIRECT_DELAY = 3; // seconds

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/", { replace: true });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

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
          <div className="bg-gray-50 rounded-3xl shadow-lg w-[500px] h-[550px] px-10 py-10 flex flex-col items-center justify-center">

            {/* Success icon */}
            <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center mb-8">
              <CheckCircle2 size={48} className="text-teal-500" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold text-gray-900 text-center">
              Successfully
            </h1>
            <p className="text-gray-500 text-lg text-center mt-3 leading-relaxed">
              Welcome back
            </p>

            {/* Progress bar */}
            <div className="w-[220px] mt-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${((REDIRECT_DELAY - countdown) / REDIRECT_DELAY) * 100}%`,
                }}
              />
            </div>
            
            <p className="text-gray-400 text-xs mt-4">
              Redirecting to sign in automatically...
            </p>

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

export default Success;