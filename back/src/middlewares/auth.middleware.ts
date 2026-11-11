import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/express";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "Kokito24/11/25";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token no proveído" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("ERROR REAL EN JWT VERIFY:", error);
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.rol || !allowedRoles.includes(user.rol)) {
      return res.status(403).json({
        error:
          "Acceso denegado: No tienes los permisos necesarios para esta ruta",
      });
    }
    next();
  };
};
