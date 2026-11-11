import { Request } from "express";

interface UserPayload {
  userId: number;
  username?: string;
  rol: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
