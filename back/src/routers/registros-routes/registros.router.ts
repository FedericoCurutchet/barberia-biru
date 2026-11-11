import { Router } from "express";
import { UsuarioController } from "../../controllers/usuario.controller";
import { checkRole, verifyToken } from "../../middlewares/auth.middleware";
import { RegistroController } from "../../controllers/registro.controller";

const registroRouter = Router();
const registroController = new RegistroController();

registroRouter.get(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  registroController.obtenerRegistros.bind(registroController),
);

export default registroRouter;
