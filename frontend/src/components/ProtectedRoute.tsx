import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/tokenUtils";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
