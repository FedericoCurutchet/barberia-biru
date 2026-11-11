import { jwtDecode } from "jwt-decode";

// @ts-ignore
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // @ts-ignore
    if (decoded.exp < currentTime) {
      return true; // Expirado
    }

    return false; // Sigue vigente
  } catch (error) {
    return true;
  }
};
