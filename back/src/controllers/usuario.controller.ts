import { type Request, type Response } from "express";
import { UsuarioRepository } from "../repositories/usuario.repository";
import { UsuarioService } from "../services/usuario.service";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
export class UsuarioController {
  constructor() {}
  public crearUsuario = async (req: Request, res: Response) => {
    try {
      const { nombre, contrasena, nombre_usuario, email } = req.body;
      const usuario = await usuarioService.crearUsuario(
        nombre,
        contrasena,
        nombre_usuario,
        email,
      );
      res.status(200).json(usuario);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error al crear el usuario", err });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { nombre_usuario, contrasena } = req.body;
      const login = await usuarioService.login(nombre_usuario, contrasena);
      res.status(200).json(login);
    } catch (error) {
      res.status(500).json({ message: "Error al logearse", error });
    }
  };
}
