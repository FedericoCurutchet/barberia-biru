import { prisma } from "../config/prisma";
export class PrecioCorteRepositry {
  async crearPrecioCorte(monto: number) {
    const result = await prisma.precioCorte.create({
      data: {
        monto: monto,
      },
    });
    return result;
  }

  async obtenerPrecioCorteActivo() {
    const result = await prisma.precioCorte.findFirst({
      where: {
        activo: true,
      },
    });

    return result;
  }

  async editarPrecioCorte(id: number, monto: number) {
    const result = await prisma.precioCorte.update({
      where: {
        id: id,
      },
      data: {
        monto: monto,
      },
    });

    return result;
  }
}
