import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import Success from "./pages/Success";
import Dashboard from "./pages/Dashboard";

import ForgotPassword from "./pages/ForgotPassword";
import CheckInbox from "./pages/CheckInbox";
import ResetPassword from "./pages/ResetPassword";
import ResetSuccess from "./pages/ResetSuccess";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public routes ──────────────────────────────── */}
          <Route path="/"            element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/verify-otp"  element={<OtpVerification />} />
          <Route path="/success"     element={<Success />} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-inbox"     element={<CheckInbox />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/reset-success"   element={<ResetSuccess />} />

          {/* ── Protected routes ───────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;