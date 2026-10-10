import Decimal from "decimal.js";
import { prisma } from "../config/prisma";

export class CorteRepository {
  async crearCorte(
    cliente: string,
    monto: Decimal,
    montoBarberia: Decimal,
    comisionBarbero: Decimal,
    barberoId: number,
    metodoPago: string,
    hora?: Date,
  ) {
    const result = await prisma.corte.create({
      data: {
        cliente: cliente,
        monto: monto,
        comisionBarbero: comisionBarbero,
        montoBarberia: montoBarberia,
        barberoId: barberoId,
        metodoPago: metodoPago,
        hora: hora ?? new Date(),
      },
      include: { barbero: true },
    });

    return result;
  }
  async editarCorte(
    id: number,
    cliente?: string,
    monto?: Decimal,
    montoBarberia?: Decimal,
    comisionBarbero?: Decimal,
    barberoId?: number,
    hora?: Date,
  ) {
    const result = await prisma.corte.update({
      where: { id: id },
      data: {
        cliente: cliente,
        monto: monto,
        montoBarberia: montoBarberia,
        comisionBarbero: comisionBarbero,
        barberoId: barberoId,
        hora: hora ?? new Date(),
      },
      include: {
        barbero: true,
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
    const result = await prisma.corte.findMany({
      include: { barbero: true },
    });
    return result;
  }

  async obtenerCortesBarbero(barberoId: number) {
    const result = await prisma.corte.findMany({
      where: {
        barberoId: barberoId,
      },
      include: { barbero: true },
    });

    return result;
  }

  async obtenerResumenBarbero(fecha_incio: Date, fecha_final: Date) {
    // const result = await prisma.corte.groupBy({
    //   by: ["barberoId"],
    //   where: {
    //     hora: {
    //       gte: fecha_incio,
    //       lte: fecha_final,
    //     },
    //   },
    //   _sum: {
    //     monto: true,
    //     comisionBarbero: true,
    //   },
    //   _count: {
    //     id: true,
    //   },
    // });
    const result = await prisma.$queryRaw`
  SELECT
    c.barberoId,
    b.nombre,
    SUM(c.monto) AS monto,
    SUM(c.comisionBarbero) AS comisionBarbero,
    COUNT(c.id) AS cantidadCortes
  FROM corte c
  INNER JOIN barbero b
    ON c.barberoId = b.id
  WHERE c.hora >= ${fecha_incio}
    AND c.hora <= ${fecha_final}
  GROUP BY c.barberoId, b.nombre
`;
    return result;
  }

  async obtenerTotalCortes(fecha_incio: Date, fecha_final: Date) {
    const result = await prisma.corte.aggregate({
      where: { hora: { gte: fecha_incio, lte: fecha_final } },
      _sum: {
        monto: true,
        montoBarberia: true,
        comisionBarbero: true,
      },
    });
    return result;
  }

  async obtenerTodosLosCortesPorFecha(fecha_incio: Date, fecha_final: Date) {
    const result = await prisma.corte.findMany({
      where: {
        hora: {
          gte: fecha_incio,
          lte: fecha_final,
        },
      },
      include: { barbero: true },
    });
    return result;
  }
}
