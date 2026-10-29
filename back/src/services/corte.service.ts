import Decimal from "decimal.js";
import { CorteRepository } from "../repositories/corte.repository";
import { BarberoService } from "./barbero.service";
import { RegistroRepository } from "../repositories/registro.repository";

export class CorteService {
  constructor(
    private corteRepository: CorteRepository,
    private registroRepository: RegistroRepository,
    private barberoService: BarberoService,
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
      throw new Error("No se encontró al barbero");
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

    const fechaHora = hora ?? new Date();
    const textoRegistrar = `registró el siguiente corte { Cliente: ${cliente}, Monto: ${monto.toString()}, Monto Barbería: ${montoBarberia.toString()}, Comisión Barbero: ${comisionBarbero.toString()}, Barbero: ${barbero.nombre}, Método de Pago: ${metodoPago}, Hora: ${fechaHora.toLocaleString()} }`;

    await this.crearRegistro(textoRegistrar);

    return result;
  }

  async obtenerCorte(id: number) {
    const result = await this.corteRepository.obtenerCorte(id);
    if (!result) {
      throw new Error("Error al obtener el corte.");
    }

    return result;
  }

  async editarCorte(
    id: number,
    cliente?: string,
    monto?: Decimal,
    montoBarberia?: Decimal,
    comisionBarbero?: Decimal,
    barberoId?: number,
    hora_string?: string,
    metodoPago?: string,
  ) {
    const corteActual = await this.obtenerCorte(id);
    const hora = hora_string ? new Date(hora_string) : corteActual.hora;

    let comisionBarberoNueva = comisionBarbero;
    let montoBarberiaNueva = montoBarberia;

    if (monto) {
      const idBarberoParaComision = barberoId ?? corteActual.barberoId;
      let barbero = await this.barberoService.obtenerBarbero(
        Number(idBarberoParaComision),
      );
      if (barbero == null) {
        throw new Error("No se encontró al barbero");
      }
      let comision = barbero.comision;
      comisionBarberoNueva = this.calcularComisionBarbero(monto, comision);
      montoBarberiaNueva = this.calcularMontoBarberia(
        monto,
        comisionBarberoNueva,
      );
    }

    const result = await this.corteRepository.editarCorte(
      id,
      cliente,
      monto,
      montoBarberiaNueva,
      comisionBarberoNueva,
      barberoId,
      hora ?? new Date(),
    );
    if (!result) {
      throw new Error("Error al editar el corte.");
    }

    const cambios: string[] = [];
    if (cliente !== undefined) cambios.push(`Cliente: "${cliente}"`);
    if (monto !== undefined) cambios.push(`Monto: ${monto.toString()}`);
    if (montoBarberiaNueva !== undefined)
      cambios.push(`Monto Barbería: ${montoBarberiaNueva.toString()}`);
    if (comisionBarberoNueva !== undefined)
      cambios.push(`Comisión Barbero: ${comisionBarberoNueva.toString()}`);
    if (barberoId !== undefined) cambios.push(`Barbero ID: ${barberoId}`);
    if (metodoPago !== undefined)
      cambios.push(`Método de Pago: "${metodoPago}"`);
    if (hora_string !== undefined) cambios.push(`Hora: ${hora_string}`);

    const detalleCambios =
      cambios.length > 0 ? cambios.join(", ") : "sin cambios especificados";
    const textoRegistrar = `editó el corte ID ${id} modificando los siguientes campos: { ${detalleCambios} }`;

    await this.crearRegistro(textoRegistrar);

    return result;
  }

  async borrarCorte(id: number) {
    const corte = await this.obtenerCorte(id);
    const result = await this.corteRepository.borrarCorte(id);
    if (!result) {
      throw new Error("Error al borrar el corte.");
    }

    const textoRegistrar = `borró el siguiente corte { Cliente: ${corte.cliente}, Monto: ${corte.monto}, Monto Barbería: ${corte.montoBarberia}, Comisión Barbero: ${corte.comisionBarbero}, Barbero ID: ${corte.barberoId}, Método de Pago: ${corte.metodoPago}, Hora: ${corte.hora} }`;

    await this.crearRegistro(textoRegistrar);

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

  async obtenerResumenBarberoDia() {
    const fecha_inicio = new Date();
    fecha_inicio.setHours(0, 0, 0, 0);
    const fecha_final = new Date();
    fecha_final.setHours(23, 59, 59, 999);
    const result = await this.corteRepository.obtenerResumenBarbero(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerResumenBarberoSemana() {
    const fecha_inicio = new Date();

    let diaDeSemana = fecha_inicio.getDay();
    let diaInicioSemana = fecha_inicio.getDate() - diaDeSemana;
    fecha_inicio.setDate(diaInicioSemana);

    const fecha_final = new Date();
    let diasFinalSemana = this.calcularDiasFinalSemana(fecha_final.getDay());
    let dias = fecha_final.getDate() + diasFinalSemana;
    fecha_final.setDate(dias);

    fecha_inicio.setHours(0, 0, 0, 0);

    console.log("fecha-inicio" + fecha_inicio);
    console.log("fecha-final" + fecha_final);
    const result = await this.corteRepository.obtenerResumenBarbero(
      fecha_inicio,
      fecha_final,
    );

    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerResumenBarberoMes(mes: number) {
    const fecha_inicio = new Date();

    fecha_inicio.setMonth(mes);
    fecha_inicio.setDate(1);
    fecha_inicio.setHours(0, 0, 0, 0);

    const fecha_final = new Date();

    fecha_final.setMonth(mes + 1);
    fecha_final.setDate(0);
    fecha_final.setHours(23, 59, 59, 999);

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

  async obtenerResumenTotalDia() {
    const fecha_inicio = new Date();
    fecha_inicio.setHours(0, 0, 0, 0);
    const fecha_final = new Date();
    fecha_final.setHours(23, 59, 59, 999);
    const result = await this.corteRepository.obtenerTotalCortes(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerResumenTotalSemana() {
    const fecha_inicio = new Date();

    let diaDeSemana = fecha_inicio.getDay();
    let diaInicioSemana = fecha_inicio.getDate() - diaDeSemana;
    fecha_inicio.setDate(diaInicioSemana);

    const fecha_final = new Date();
    let diasFinalSemana = this.calcularDiasFinalSemana(fecha_final.getDay());
    let dias = fecha_final.getDate() + diasFinalSemana;
    fecha_final.setDate(dias);

    fecha_inicio.setHours(0, 0, 0, 0);

    console.log("fecha-inicio" + fecha_inicio);
    console.log("fecha-final" + fecha_final);
    const result = await this.corteRepository.obtenerTotalCortes(
      fecha_inicio,
      fecha_final,
    );

    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerResumenTotalMes(mes: number) {
    const fecha_inicio = new Date();

    fecha_inicio.setMonth(mes);
    fecha_inicio.setDate(1);
    fecha_inicio.setHours(0, 0, 0, 0);

    const fecha_final = new Date();

    fecha_final.setMonth(mes + 1);
    fecha_final.setDate(0);
    fecha_final.setHours(23, 59, 59, 999);

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

  async obtenerCortesPorDia() {
    const fecha_inicio = new Date();
    fecha_inicio.setHours(0, 0, 0, 0);
    const fecha_final = new Date();
    fecha_final.setHours(23, 59, 59, 999);
    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerCortesPorSemanaActual() {
    const fecha_inicio = new Date();

    let diaDeSemana = fecha_inicio.getDay();
    let diaInicioSemana = fecha_inicio.getDate() - diaDeSemana;
    fecha_inicio.setDate(diaInicioSemana);

    const fecha_final = new Date();
    let diasFinalSemana = this.calcularDiasFinalSemana(fecha_final.getDay());
    let dias = fecha_final.getDate() + diasFinalSemana;
    fecha_final.setDate(dias);

    fecha_inicio.setHours(0, 0, 0, 0);

    console.log("fecha-inicio" + fecha_inicio);
    console.log("fecha-final" + fecha_final);
    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );

    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerTodosLosCortesPorMes(mes: number) {
    const fecha_inicio = new Date();

    fecha_inicio.setMonth(mes);
    fecha_inicio.setDate(1);
    fecha_inicio.setHours(0, 0, 0, 0);

    const fecha_final = new Date();

    fecha_final.setMonth(mes + 1);
    fecha_final.setDate(0);
    fecha_final.setHours(23, 59, 59, 999);

    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  async obtenerTodosLosCortesPorFecha(
    fecha_incio_string: string,
    fecha_final_string: string,
  ) {
    const [anioInicio, mesInicio, diaInicio] = fecha_incio_string
      .split("-")
      .map(Number);
    const fecha_inicio = new Date(
      anioInicio,
      mesInicio - 1,
      diaInicio,
      0,
      0,
      0,
      0,
    );

    this.obtenerCortesPorSemanaActual();

    const [anioFin, mesFin, diaFin] = fecha_final_string.split("-").map(Number);
    const fecha_final = new Date(anioFin, mesFin - 1, diaFin, 23, 59, 59, 999);

    let prueba = this.calcularDiasFinalSemana(fecha_inicio.getDay());
    console.log("aca el dia de hoy" + fecha_inicio.getDate());
    let otraPrueba = new Date();

    let pruebaCaluclar = fecha_inicio.getDate() + prueba;
    otraPrueba.setDate(pruebaCaluclar);

    let pruebaFinal = new Date();
    let pruebaFinalCalcular = pruebaFinal.getDay();
    let pruebaCaluclarFINAL2 = fecha_inicio.getDate() - pruebaFinalCalcular;
    pruebaFinal.setDate(pruebaCaluclarFINAL2);

    console.log("aca en teoria la  fecha Inicial" + otraPrueba);
    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes.");
    }

    return result;
  }

  private calcularDiasFinalSemana(dia: number) {
    let diasFaltantes = 0;

    if (6 - dia > 0) {
      diasFaltantes = 6 - dia;
    } else {
      diasFaltantes = 0;
    }

    return diasFaltantes;
  }

  private async crearRegistro(texto: string) {
    const hora = new Date();
    const textoRegistrar = `El Usuario ADMINISTRADOR a las ${hora.toLocaleDateString()} ha realizado: ${texto}`;

    await this.registroRepository.crearRegistro(hora, textoRegistrar);
  }
}
