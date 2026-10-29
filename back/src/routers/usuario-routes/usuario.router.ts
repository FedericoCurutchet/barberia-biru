import { Router } from "express";
import { UsuarioController } from "../../controllers/usuario.controller";

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.post("", usuarioController.crear.bind(usuarioController));
usuarioRouter.get(
  "/:id",
  usuarioController.obtenerPorId.bind(usuarioController),
);
usuarioRouter.get(
  "",
  usuarioController.obtenerTodosLosUsuarios.bind(usuarioController),
);
usuarioRouter.put("", usuarioController.editar.bind(usuarioController));
usuarioRouter.delete("", usuarioController.borrar.bind(usuarioController));
usuarioRouter.post(
  "/auth/login",
  usuarioController.login.bind(usuarioController),
);

export default usuarioRouter;
