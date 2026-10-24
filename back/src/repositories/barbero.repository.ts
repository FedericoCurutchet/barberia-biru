import Decimal from "decimal.js";
import { prisma } from "../config/prisma";

export class BarberoRepository {
  async crearBarbero(nombre: string, comision?: Decimal) {
    const result = await prisma.barbero.create({
      data: {
        nombre: nombre,
        comision: comision,
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

  async editarBarbero(
    id: number,
    activo?: boolean,
    nombre?: string,
    comision?: Decimal,
  ) {
    const result = await prisma.barbero.update({
      where: {
        id: id,
      },
      data: {
        nombre: nombre,
        activo: activo,
        comision: comision,
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

  async obtenerBarberosActivos() {
    const result = await prisma.barbero.findMany({
      where: {
        activo: true,
      },
    });

    return result;
  }

  async obtenerTodosLosBarberos() {
    const result = await prisma.barbero.findMany({});

    return result;
  }
}
