import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../hooks/isTokenExpired";

// @ts-ignore
export const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (
    !token ||
    token === "undefined" ||
    token === "null" ||
    isTokenExpired(token)
  ) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    // @ts-ignore
    const userRole = decodedToken.rol;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Error al decodificar el token:", error);

    localStorage.removeItem("token");

    return <Navigate to="/login" replace />;
  }
};
