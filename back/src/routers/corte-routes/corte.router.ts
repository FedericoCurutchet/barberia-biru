import { Router } from "express";
import { CorteController } from "../../controllers/corte.controller";

const corteRouter = Router();

const corteController = new CorteController();

corteRouter.post("", corteController.crearCorte.bind(corteController));
corteRouter.put("", corteController.editarCorte.bind(corteController));
corteRouter.get(
  "/resumenBarberos",
  corteController.obtenerResumenBarbero.bind(corteController),
);

corteRouter.get(
  "/resumenTotal",
  corteController.obtenerResumenTotal.bind(corteController),
);

corteRouter.get(
  "",
  corteController.obtenerTodosLosCortes.bind(corteController),
);

corteRouter.get(
  "/cortesMes",
  corteController.obtenerTodosLosCortesPorFecha.bind(corteController),
);
corteRouter.get(
  "/cortesDia",
  corteController.obtenerCortesPorDia.bind(corteController),
);
corteRouter.get(
  "/cortesSemana",
  corteController.obtenerCortesPorSemanaActual.bind(corteController),
);
corteRouter.get(
  "/cortesDelMes",
  corteController.obtenerTodosLosCortesPorMes.bind(corteController),
);

corteRouter.delete("", corteController.borrarCorte.bind(corteController));

export default corteRouter;
