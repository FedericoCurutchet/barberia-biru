import { prisma } from "../config/prisma";
import { RolUsuario } from "../../generated/prisma/enums";

export class UsuarioRepository {
  async crearUsuario(
    nombre: string,
    contrasena: string,
    nombre_usuario: string,
    email: string,
    rol?: RolUsuario,
  ) {
    const result = await prisma.usuario.create({
      data: {
        nombre: nombre,
        contrasena: contrasena,
        nombreUsuario: nombre_usuario,
        email: email,
        rol: rol,
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
    contrasena?: string | null,
    nombre_usuario?: string,
    rol?: RolUsuario,
  ) {
    const dataToUpdate: any = {};

    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (nombre_usuario !== undefined)
      dataToUpdate.nombreUsuario = nombre_usuario;
    if (rol !== undefined) dataToUpdate.rol = rol;

    if (contrasena && contrasena.trim() !== "") {
      dataToUpdate.contrasena = contrasena;
    }

    const result = await prisma.usuario.update({
      where: { id: id },
      data: dataToUpdate,
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

  async obtenerTodosLosUsuarios() {
    const result = await prisma.usuario.findMany();
    return result;
  }
}
