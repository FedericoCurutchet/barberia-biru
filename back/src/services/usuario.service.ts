import { RolUsuario } from "../../generated/prisma/enums";
import { UsuarioRepository } from "../repositories/usuario.repository";

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
  }

  async crearUsuario(
    nombre: string,
    contrasena: string,
    nombre_usuario: string,
    email: string,
    rol?: RolUsuario,
  ) {
    return await this.usuarioRepository.crearUsuario(
      nombre,
      contrasena,
      nombre_usuario,
      email,
      rol,
    );
  }

  async obtenerUsuario(id: number | string) {
    const numericId = Number(id);
    const usuario = await this.usuarioRepository.obtenerUsuario(numericId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }

  async editarUsuario(
    id: number | string,
    nombre?: string,
    contrasena?: string | null,
    nombre_usuario?: string,
    rol?: RolUsuario,
  ) {
    const numericId = Number(id);
    return await this.usuarioRepository.editarUsuario(
      numericId,
      nombre,
      contrasena,
      nombre_usuario,
      rol,
    );
  }

  async login(nombre_usuario: string, contrasena: string) {
    const usuario =
      await this.usuarioRepository.buscarUsuarioPorNombreUsuarioYContrasena(
        nombre_usuario,
        contrasena,
      );
    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }
    return usuario;
  }

  async borrarUsuario(id: number | string) {
    const numericId = Number(id);
    return await this.usuarioRepository.borrarUsuario(numericId);
  }

  async obtenerTodosLosUsuarios() {
    return await this.usuarioRepository.obtenerTodosLosUsuarios();
  }
}
