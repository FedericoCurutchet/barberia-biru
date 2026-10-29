import { Request, Response } from "express";

import { RolUsuario } from "../../generated/prisma/enums";
import { UsuarioService } from "../services/usuario.service";

const usuarioService = new UsuarioService();

export class UsuarioController {
  async crear(req: Request, res: Response) {
    try {
      const { nombre, contrasena, nombreUsuario, email, rol } = req.body;

      const nuevoUsuario = await usuarioService.crearUsuario(
        nombre,
        contrasena,
        nombreUsuario,
        email,
        rol as RolUsuario,
      );

      return res.status(201).json(nuevoUsuario);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "Error al crear usuario" });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.obtenerUsuario(id);
      return res.status(200).json(usuario);
    } catch (error: any) {
      return res
        .status(404)
        .json({ error: error.message || "Usuario no encontrado" });
    }
  }

  async editar(req: Request, res: Response) {
    try {
      const { id, nombre, contrasena, nombreUsuario, rol } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "El ID del usuario es obligatorio en el body" });
      }

      const usuarioActualizado = await usuarioService.editarUsuario(
        Number(id),
        nombre,
        contrasena,
        nombreUsuario,
        rol as RolUsuario,
      );

      return res.status(200).json(usuarioActualizado);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "Error al actualizar usuario" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { nombreUsuario, contrasena } = req.body;
      const usuario = await usuarioService.login(nombreUsuario, contrasena);
      return res.status(200).json({ mensaje: "Login exitoso", usuario });
    } catch (error: any) {
      return res
        .status(401)
        .json({ error: error.message || "Credenciales incorrectas" });
    }
  }

  async borrar(req: Request, res: Response) {
    try {
      const { id } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "El ID del usuario es obligatorio en el body" });
      }

      await usuarioService.borrarUsuario(Number(id));
      return res
        .status(200)
        .json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "Error al eliminar usuario" });
    }
  }

  async obtenerTodosLosUsuarios(req: Request, res: Response) {
    try {
      const result = await usuarioService.obtenerTodosLosUsuarios();
      return res.status(200).json(result);
    } catch (error: any) {
      return res
        .status(400)
        .json({ error: error.message || "Error al buscar todos los usuarios" });
    }
  }
}
