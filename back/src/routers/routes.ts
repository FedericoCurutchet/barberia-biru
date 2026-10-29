import { Router } from "express";
import corteRouter from "./corte-routes/corte.router";
import barberoRouter from "./barbero-routes/barbero.router";
import usuarioRouter from "./usuario-routes/usuario.router";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/corte", corteRouter);
    router.use("/api/barberos", barberoRouter);
    router.use("/api/usuarios", usuarioRouter);
    return router;
  }
}
