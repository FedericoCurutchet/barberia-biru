import Decimal from "decimal.js";
import { prisma } from "../config/prisma";

export class CorteRepository {
  async crearCorte(
    cliente: string,
    monto: Decimal,
    tipoCorteId: number,
    barberoId: number,
    hora?: Date,
  ) {
    const result = await prisma.corte.create({
      data: {
        cliente: cliente,
        monto: monto,
        tipoCorteId: tipoCorteId,
        barberoId: barberoId,
        hora: hora ?? new Date(),
      },
    });

    return result;
  }
  async editarCorte(
    id: number,
    cliente?: string,
    monto?: Decimal,
    tipoCorteId?: number,
    barberoId?: number,
    hora?: Date,
  ) {
    const result = await prisma.corte.update({
      where: { id: id },
      data: {
        cliente: cliente,
        monto: monto,
        tipoCorteId: tipoCorteId,
        barberoId: barberoId,
        hora: hora ?? new Date(),
      },
    });

    return result;
  }
  async obtenerCorte(id: number) {
    const result = await prisma.corte.findFirst({
      where: { id: id },
    });
    return result;
  }
  async borrarCorte(id: number) {
    const result = await prisma.corte.delete({
      where: { id: id },
    });
    return result;
  }

  async obtenerTodosLosCortes() {
    const result = await prisma.corte.findMany({ include: { barbero: true } });
    return result;
  }

  async obtenerCortesBarbero(barberoId: number) {
    const result = await prisma.corte.findMany({
      where: {
        barberoId: barberoId,
      },
    });

    return result;
  }
}
