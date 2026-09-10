import { prisma } from "../config/prisma";

export class UsuarioRepository {
  async crearUsuario(
    nombre: string,
    contrasena: string,
    nombre_usuario: string,
    email: string,
  ) {
    const result = await prisma.usuario.create({
      data: {
        nombre: nombre,
        contrasena: contrasena,
        nombreUsuario: nombre_usuario,
        email: email,
      },
    });

    return result;
  }

  async obtenerUsuario(id: number) {
    const result = await prisma.usuario.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }

  async editarUsuario(
    id: number,
    nombre?: string,
    contrasena?: string,
    nombre_usuario?: string,
  ) {
    const result = await prisma.usuario.update({
      where: { id: id },
      data: {
        nombre: nombre,
        contrasena: contrasena,
        nombreUsuario: nombre_usuario,
      },
    });

    return result;
  }

  async buscarUsuarioPorNombreUsuarioYContrasena(
    nombre_usuario: string,
    contrasena: string,
  ) {
    const result = await prisma.usuario.findFirst({
      where: {
        nombreUsuario: nombre_usuario,
        contrasena: contrasena,
      },
    });

    return result;
  }

  async borrarUsuario(id: number) {
    const result = await prisma.usuario.delete({
      where: {
        id: id,
      },
    });

    return result;
  }
}
