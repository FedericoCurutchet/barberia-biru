import { UsuarioRepository } from "../repositories/usuario.repository";

export class UsuarioService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async crearUsuario(
    nombre: string,
    contrasena: string,
    nombre_usuario: string,
  ) {
    const result = await this.usuarioRepository.crearUsuario(
      nombre,
      contrasena,
      nombre_usuario,
    );
    if (!result) {
      throw new Error("Error al crear el usuario.");
    }
    return result;
  }

  async login(nombre_usuario: string, contrasena: string) {
    const result =
      await this.usuarioRepository.buscarUsuarioPorNombreUsuarioYContrasena(
        nombre_usuario,
        contrasena,
      );
    if (!result) {
      throw new Error("Error al logearse.");
    }
    return result;
  }
}
