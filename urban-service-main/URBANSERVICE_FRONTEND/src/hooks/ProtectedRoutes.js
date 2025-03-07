import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

export const ProtectedRoutes = ({ allowedRoles }) => {
  const location = useLocation();
  const userRole = getUserRole();

  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/404" state={{ from: location }} replace />;

  return <Outlet />;
};