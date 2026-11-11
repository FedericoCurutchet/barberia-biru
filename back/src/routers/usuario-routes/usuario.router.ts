import { Router } from "express";
import { UsuarioController } from "../../controllers/usuario.controller";
import { checkRole, verifyToken } from "../../middlewares/auth.middleware";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.post(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  usuarioController.crear.bind(usuarioController),
);
usuarioRouter.get(
  "/:id",
  usuarioController.obtenerPorId.bind(usuarioController),
);
usuarioRouter.get(
  "",
  usuarioController.obtenerTodosLosUsuarios.bind(usuarioController),
);
usuarioRouter.put(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  usuarioController.editar.bind(usuarioController),
);
usuarioRouter.delete(
  "",
  [verifyToken, checkRole(["ADMINISTRADOR"])],
  usuarioController.borrar.bind(usuarioController),
);
usuarioRouter.post(
  "/auth/login",
  usuarioController.login.bind(usuarioController),
);

export default usuarioRouter;
