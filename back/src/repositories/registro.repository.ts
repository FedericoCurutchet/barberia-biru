import { prisma } from "../config/prisma";

export class RegistroRepository {
  async crearRegistro(hora: Date, texto: string) {
    const result = await prisma.registro.create({
      data: {
        hora: hora,
        registro: texto,
      },
    });

    return result;
  }

  async obtenerRegistroEspecifico(id: number) {
    const result = await prisma.registro.findFirst({
      where: { id: id },
    });

    return result;
  }

  async obtenerTodosLosRegistros() {
    const result = await prisma.registro.findMany();
    return result;
  }
}
