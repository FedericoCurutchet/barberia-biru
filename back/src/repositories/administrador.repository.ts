import { prisma } from "../config/prisma";
export class AdministradorRepository {
  async verificarAdministrador(nombre: string, contrasena: string) {
    const result = await prisma.administrador.findFirst({
      where: {
        nombre: nombre,
        contrasena: contrasena,
      },
    });
    return result;
  }
}
