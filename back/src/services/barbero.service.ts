import Decimal from "decimal.js";
import { BarberoRepository } from "../repositories/barbero.repository";
import { RegistroRepository } from "../repositories/registro.repository";
// import { RegistroRepository } from "../repositories/registro.repository";

export class BarberoService {
  constructor(
    private barberoRepository: BarberoRepository,
    private registroRepository: RegistroRepository,
  ) {}

  async crearBarbero(nombre: string, comision: Decimal) {
    const result = await this.barberoRepository.crearBarbero(nombre, comision);
    if (!result) {
      throw new Error("Error al crear el barbero.");
    }

    await this.crearRegistro(
      `Creación del barbero "${nombre}" con comisión ${comision.toString()}`,
    );

    return result;
  }

  async obtenerBarbero(id: number) {
    const result = await this.barberoRepository.obtenerBarbero(id);
    if (!result) {
      throw new Error("Error al obtener el barbero.");
    }

    return result;
  }

  async editarBarbero(
    id: number,
    activo?: boolean,
    nombre?: string,
    comision?: Decimal,
  ) {
    const result = await this.barberoRepository.editarBarbero(
      id,
      activo,
      nombre,
      comision,
    );

    if (!result) {
      throw new Error(`Error al editar el barbero con ID ${id}.`);
    }

    const cambios: string[] = [];
    if (nombre !== undefined) cambios.push(`nombre a "${nombre}"`);
    if (comision !== undefined)
      cambios.push(`comisión a ${comision.toString()}`);
    if (activo !== undefined) cambios.push(`estado activo a ${activo}`);

    const detalleCambios =
      cambios.length > 0 ? cambios.join(", ") : "sin cambios especificados";
    await this.crearRegistro(
      `Edición del barbero ID ${id}: se modificó ${detalleCambios}`,
    );

    return result;
  }

  async borrarBarbero(id: number) {
    const result = await this.barberoRepository.borrarBarbero(id);
    if (!result) {
      throw new Error("Error al borrar el barbero.");
    }

    await this.crearRegistro(`Eliminación del barbero con ID ${id}`);

    return result;
  }

  async obtenerBarberosActivos() {
    const result = await this.barberoRepository.obtenerBarberosActivos();
    if (!result) {
      throw new Error("Error al obtener los barberos.");
    }

    return result;
  }

  async obtenerTodosLosBarberos() {
    const result = await this.barberoRepository.obtenerTodosLosBarberos();
    if (!result) {
      throw new Error("Error al obtener los barberos.");
    }

    return result;
  }

  private async crearRegistro(texto: string) {
    const hora = new Date();
    const textoRegistrar = `El Usuario ADMINISTRADOR a las ${hora.toLocaleString()} ha realizado: ${texto}`;

    await this.registroRepository.crearRegistro(hora, textoRegistrar);
  }
}
