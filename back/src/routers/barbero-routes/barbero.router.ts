import { Router } from "express";
import { BarberoController } from "../../controllers/barbero.controller";
import { checkRole, verifyToken } from "../../middlewares/auth.middleware";

const barberoRouter = Router();
const barberoController = new BarberoController();

barberoRouter.get(
  "",
  [verifyToken],
  barberoController.obtenerBarberosActivos.bind(barberoController),
);
barberoRouter.get(
  "/barbero",
  [verifyToken],
  barberoController.obtenerBarbero.bind(barberoController),
);
barberoRouter.get(
  "/barberosTotales",
  [verifyToken],
  barberoController.obtenerTodosLosBarberos.bind(barberoController),
);
barberoRouter.post(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  barberoController.crearBarbero.bind(barberoController),
);
barberoRouter.put(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  barberoController.editarBarbero.bind(barberoController),
);
barberoRouter.delete(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  barberoController.borrarBarbero.bind(barberoController),
);

export default barberoRouter;
