import { prisma } from "../config/prisma";

export class BarberoRepository {
  async crearBarbero(nombre: string) {
    const result = await prisma.barbero.create({
      data: {
        nombre: nombre,
      },
    });

    return result;
  }

  async obtenerBarbero(id: number) {
    const result = await prisma.barbero.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }

  async editarBarbero(id: number, activo?: boolean, nombre?: string) {
    const result = await prisma.barbero.update({
      where: {
        id: id,
      },
      data: {
        nombre: nombre,
        activo: activo,
      },
    });
    return result;
  }

  async borrarBarbero(id: number) {
    const result = await prisma.barbero.delete({
      where: {
        id: id,
      },
    });

    return result;
  }
}
