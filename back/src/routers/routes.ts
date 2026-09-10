import { Router } from "express";
import corteRouter from "./corte-routes/corte.router";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/corte", corteRouter);
    return router;
  }
}
