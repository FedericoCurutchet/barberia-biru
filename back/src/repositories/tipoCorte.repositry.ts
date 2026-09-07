import { prisma } from "../config/prisma";

export class TipoCorteRepository {
  async crearTipoCorte(nombre: string) {
    const result = await prisma.tipoCorte.create({
      data: {
        nombre: nombre,
      },
    });

    return result;
  }
  async editarTipoCorte(id: number, nombre?: string, activo?: boolean) {
    const result = await prisma.tipoCorte.update({
      where: { id: id },
      data: {
        nombre: nombre,
        activo: activo,
      },
    });

    return result;
  }
  async obtenerTipoCorte(id: number) {
    const result = await prisma.tipoCorte.findFirst({
      where: { id: id },
    });
    return result;
  }
  async borrarTipoCorte(id: number) {
    const result = await prisma.tipoCorte.delete({
      where: { id: id },
    });
    return result;
  }
}
