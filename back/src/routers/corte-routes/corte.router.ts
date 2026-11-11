import { Router } from "express";
import { CorteController } from "../../controllers/corte.controller";
import { checkRole, verifyToken } from "../../middlewares/auth.middleware";

const corteRouter = Router();

const corteController = new CorteController();

corteRouter.post(
  "",
  [verifyToken],
  corteController.crearCorte.bind(corteController),
);
corteRouter.put(
  "",
  [verifyToken],
  corteController.editarCorte.bind(corteController),
);
corteRouter.get(
  "/resumenBarberos",
  [verifyToken],
  corteController.obtenerResumenBarbero.bind(corteController),
);

corteRouter.get(
  "/resumenTotal",
  [verifyToken],
  corteController.obtenerResumenTotal.bind(corteController),
);

corteRouter.get(
  "",
  [verifyToken],
  corteController.obtenerTodosLosCortes.bind(corteController),
);

corteRouter.get(
  "/cortesMes",
  [verifyToken],
  corteController.obtenerTodosLosCortesPorFecha.bind(corteController),
);
corteRouter.get(
  "/cortesDia",
  [verifyToken],
  corteController.obtenerCortesPorDia.bind(corteController),
);
corteRouter.get(
  "/cortesSemana",
  [verifyToken],
  corteController.obtenerCortesPorSemanaActual.bind(corteController),
);
corteRouter.get(
  "/cortesDelMes",
  [verifyToken],
  corteController.obtenerTodosLosCortesPorMes.bind(corteController),
);
corteRouter.get(
  "/resumenTotalDia",
  [verifyToken],
  corteController.obtenerResumenTotalDia.bind(corteController),
);
corteRouter.get(
  "/resumenTotalSemana",
  [verifyToken],
  corteController.obtenerResumenTotalSemana.bind(corteController),
);
corteRouter.get(
  "/resumenTotalMes",
  [verifyToken],
  corteController.obtenerResumenTotalMes.bind(corteController),
);
corteRouter.get(
  "/resumenBarberosDia",
  [verifyToken],
  corteController.obtenerResumenBarberoDia.bind(corteController),
);
corteRouter.get(
  "/resumenBarberosSemana",
  [verifyToken],
  corteController.obtenerResumenBarberoSemana.bind(corteController),
);
corteRouter.get(
  "/resumenBarberosMes",
  [verifyToken],
  corteController.obtenerResumenBarberoMes.bind(corteController),
);

corteRouter.delete(
  "",
  [verifyToken],
  corteController.borrarCorte.bind(corteController),
);

export default corteRouter;
