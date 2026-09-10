import { Router } from "express";
import { BarberoController } from "../../controllers/barbero.controller";

const barberoRouter = Router();
const barberoController = new BarberoController();

barberoRouter.get(
  "",
  barberoController.obtenerBarberosActivos.bind(barberoController),
);
barberoRouter.get(
  "/barbero",
  barberoController.obtenerBarbero.bind(barberoController),
);
barberoRouter.post("", barberoController.crearBarbero.bind(barberoController));
barberoRouter.put("", barberoController.editarBarbero.bind(barberoController));
barberoRouter.delete(
  "",
  barberoController.borrarBarbero.bind(barberoController),
);

export default barberoRouter;
