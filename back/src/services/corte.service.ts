import Decimal from "decimal.js";
import { CorteRepository } from "../repositories/corte.repository";
import { BarberoSerivce } from "./barbero.service";

export class CorteService {
  constructor(
    private corteRepository: CorteRepository,
    private barberoService: BarberoSerivce,
  ) {}

  async crearCorte(
    cliente: string,
    monto: Decimal,
    barberoId: number,
    metodoPago: string,
    hora?: Date,
  ) {
    let barbero = await this.barberoService.obtenerBarbero(barberoId);
    if (barbero == null) {
      throw new Error("No se enconro al barbero");
    }
    let comision = barbero.comision;
    const comisionBarbero = this.calcularComisionBarbero(monto, comision);
    const montoBarberia = this.calcularMontoBarberia(monto, comisionBarbero);
    const result = await this.corteRepository.crearCorte(
      cliente,
      monto,
      montoBarberia,
      comisionBarbero,
      barberoId,
      metodoPago,
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
    montoBarberia?: Decimal,
    comisionBarbero?: Decimal,
    barberoId?: number,
    hora_string?: string,
  ) {
    const hora = new Date(hora_string ?? new Date());
    const result = await this.corteRepository.editarCorte(
      id,
      cliente,
      monto,
      montoBarberia,
      comisionBarbero,
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

  async obtenerTodosLosCrotesDeUnBarbero(id: number) {
    const result = await this.corteRepository.obtenerCortesBarbero(id);
    if (!result) {
      throw new Error("Error al obtener los cortes del barbero.");
    }

    return result;
  }

  async calcularMontoBarbero(id: number) {
    const result = await this.corteRepository.obtenerCortesBarbero(id);
    if (result[0].barbero.comision !== null) {
      result.forEach((element) => {});
    }
  }

  async obtenerTotalCortes() {
    const result = await this.corteRepository.obtenerTodosLosCortes();
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerResumenBarbero(
    fecha_incio_string: string,
    fecha_final_string: string,
  ) {
    const fecha_inicio = new Date(fecha_incio_string);
    const fecha_final = new Date(fecha_final_string);

    const result = await this.corteRepository.obtenerResumenBarbero(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerResumenTotal(
    fecha_incio_string: string,
    fecha_final_string: string,
  ) {
    const fecha_inicio = new Date(fecha_incio_string);
    const fecha_final = new Date(fecha_final_string);
    const result = await this.corteRepository.obtenerTotalCortes(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  private calcularComisionBarbero(
    montoCorte: Decimal,

    comisionBarbero: Decimal,
  ) {
    let comision = new Decimal(montoCorte).mul(comisionBarbero).div(100);

    return comision;
  }

  private calcularMontoBarberia(
    montoCorte: Decimal,

    comisionBarbero: Decimal,
  ) {
    let monto = new Decimal(montoCorte).minus(comisionBarbero);

    return monto;
  }
}
