import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

export const PublicRoutes = () => {
  return isAuthenticated() ? <Navigate to={`/${getUserRole()}/dashboard`} /> : <Outlet />;
};