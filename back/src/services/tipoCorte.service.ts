import { TipoCorteRepository } from "../repositories/tipoCorte.repositry";

export class TipoCorteService {
  constructor(private tipoCorteRepositry: TipoCorteRepository) {}

  async crearTipoCorte(nombre: string) {
    const result = await this.tipoCorteRepositry.crearTipoCorte(nombre);
    if (!result) {
      throw new Error("Error al crear el tipo decorte.");
    }

    return result;
  }
  async obtenerTipoCorte(id: number) {
    const result = await this.tipoCorteRepositry.obtenerTipoCorte(id);

    if (!result) {
      throw new Error("Error al obtener el tipo decorte.");
    }

    return result;
  }
  async editarTipoCorte(id: number, nombre?: string, activo?: boolean) {
    const result = await this.tipoCorteRepositry.editarTipoCorte(
      id,
      nombre,
      activo,
    );
    if (!result) {
      throw new Error("Error al editar el tipo de corte.");
    }

    return result;
  }
  async borrarTipoCorte(id: number) {
    const result = await this.tipoCorteRepositry.borrarTipoCorte(id);

    if (!result) {
      throw new Error("Error al borrar el tipo decorte.");
    }

    return result;
  }
}
