import { Router } from "express";
import corteRouter from "./corte-routes/corte.router";
import barberoRouter from "./barbero-routes/barbero.router";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/corte", corteRouter);
    router.use("/api/barberos", barberoRouter);
    return router;
  }
}
