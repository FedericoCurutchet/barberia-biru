import Decimal from "decimal.js";
import { BarberoRepository } from "../repositories/barbero.repository";

export class BarberoSerivce {
  constructor(private barberoRepository: BarberoRepository) {}

  async crearBarbero(nombre: string, comision: Decimal) {
    const result = await this.barberoRepository.crearBarbero(nombre, comision);
    if (!result) {
      throw new Error("Error al crear el barbero.");
    }

    return result;
  }

  async obtenerBarbero(id: number) {
    const result = await this.barberoRepository.obtenerBarbero(id);
    if (!result) {
      throw new Error("Error al obtener el barbero.");
    }

    return result;
  }
  async editarBarbero(id: number, activo?: boolean, nombre?: string) {
    const result = await this.barberoRepository.editarBarbero(
      id,
      activo,
      nombre,
    );

    if (!result) {
      throw new Error("Error al editar el barbero.");
    }

    return result;
  }
  async borrarBarbero(id: number) {
    const result = await this.barberoRepository.borrarBarbero(id);
    if (!result) {
      throw new Error("Error al borrar el barbero.");
    }

    return result;
  }
}
