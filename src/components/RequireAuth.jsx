import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contextAPI/Authcontext";

function RequireAuth({ children }) {
  const { isAuthenticated, authReady } = useContext(AuthContext);
  const location = useLocation();

  // Wait for auth to initialise before deciding
  if (!authReady) return null;

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
