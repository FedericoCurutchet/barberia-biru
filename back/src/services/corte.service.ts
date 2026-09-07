import Decimal from "decimal.js";
import { CorteRepository } from "../repositories/corte.repository";

export class CorteService {
  constructor(private corteRepository: CorteRepository) {}

  async crearCorte(
    cliente: string,
    monto: Decimal,
    tipoCorteId: number,
    barberoId: number,
    hora?: Date,
  ) {
    const result = await this.corteRepository.crearCorte(
      cliente,
      monto,
      tipoCorteId,
      barberoId,
      hora,
    );
    if (!result) {
      throw new Error("Error al guardar el corte.");
    }

    return result;
  }
  async obtenerCorte(id: number) {
    const result = await this.corteRepository.obtenerCorte(id);
    if (!result) {
      throw new Error("Error al obtener el corte.");
    }

    return result;
  }
  async edtiarCorte(
    id: number,
    cliente?: string,
    monto?: Decimal,
    tipoCorteId?: number,
    barberoId?: number,
    hora?: Date,
  ) {
    const result = await this.corteRepository.editarCorte(
      id,
      cliente,
      monto,
      tipoCorteId,
      barberoId,
      hora,
    );
    if (!result) {
      throw new Error("Error al editar el corte.");
    }

    return result;
  }
  async borrarCorte(id: number) {
    const result = await this.corteRepository.borrarCorte(id);
    if (!result) {
      throw new Error("Error al borrar el corte.");
    }

    return result;
  }
}
