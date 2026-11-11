import Decimal from "decimal.js";
import { CorteRepository } from "../repositories/corte.repository";
import { BarberoService } from "./barbero.service";
import { RegistroRepository } from "../repositories/registro.repository";
import { UsuarioRepository } from "../repositories/usuario.repository";
import bcrypt from "bcryptjs";

export class CorteService {
  private corteRepository: CorteRepository;
  private registroRepository: RegistroRepository;
  private barberoService: BarberoService;
  private usuarioRepository: UsuarioRepository;
  constructor() {
    this.corteRepository = new CorteRepository();
    this.registroRepository = new RegistroRepository();
    this.barberoService = new BarberoService();
    this.usuarioRepository = new UsuarioRepository();
  }

  // CRUD

  async crearCorte(
    cliente: string,
    monto: Decimal,
    barberoId: number,
    metodoPago: string,
    hora?: Date,
    nombre_usuario_admin?: string,
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

    await this.crearRegistro(textoRegistrar, nombre_usuario_admin);

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
    nombre_usuario_admin?: string,
    rol?: string,
  ) {
    const corteActual = await this.obtenerCorte(id);
    const hora = hora_string ? new Date(hora_string) : corteActual.hora;

    if (!(await this.verificarPuedeRealizarAccion(hora, rol))) {
      throw new Error("No tenes permitido realizar esta accion");
    }

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

    await this.crearRegistro(textoRegistrar, nombre_usuario_admin);

    return result;
  }

  async borrarCorte(id: number, nombre_usuario_admin?: string, rol?: string) {
    if (!(await this.verificarPuedeRealizarAccion(new Date(), rol))) {
      throw new Error("No tenes permitido realizar esta accion");
    }
    const corte = await this.obtenerCorte(id);
    const result = await this.corteRepository.borrarCorte(id);
    if (!result) {
      throw new Error("Error al borrar el corte.");
    }

    const textoRegistrar = `borró el siguiente corte { Cliente: ${corte.cliente}, Monto: ${corte.monto}, Monto Barbería: ${corte.montoBarberia}, Comisión Barbero: ${corte.comisionBarbero}, Barbero ID: ${corte.barberoId}, Método de Pago: ${corte.metodoPago}, Hora: ${corte.hora} }`;

    await this.crearRegistro(textoRegistrar, nombre_usuario_admin);

    return result;
  }

  // OBTENCION DE DATOS

  async obtenerTodosLosCrotesDeUnBarbero(id: number) {
    const result = await this.corteRepository.obtenerCortesBarbero(id);
    if (!result) {
      throw new Error("Error al obtener los cortes del barbero.");
    }

    return result;
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
      throw new Error("Error al obtener el resumen del barbero.");
    }

    return result;
  }

  async obtenerResumenBarberoDia() {
    const fecha_inicio = this.calcularFechaInicio("dia");
    const fecha_final = this.calcularFechaFinal("dia");

    const result = await this.corteRepository.obtenerResumenBarbero(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener el resumen del barbero por día.");
    }

    return result;
  }

  async obtenerResumenBarberoSemana() {
    const fecha_inicio = this.calcularFechaInicio("semana");
    const fecha_final = this.calcularFechaFinal("semana");

    const result = await this.corteRepository.obtenerResumenBarbero(
      fecha_inicio,
      fecha_final,
    );

    if (!result) {
      throw new Error("Error al obtener el resumen del barbero por semana.");
    }

    return result;
  }

  async obtenerResumenBarberoMes(mes: number) {
    const fecha_inicio = this.calcularFechaInicio("mes", mes);
    const fecha_final = this.calcularFechaFinal("mes", mes);

    const result = await this.corteRepository.obtenerResumenBarbero(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener el resumen del barbero por mes.");
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
      throw new Error("Error al obtener el resumen total.");
    }

    return result;
  }

  async obtenerResumenTotalDia() {
    const fecha_inicio = this.calcularFechaInicio("dia");
    const fecha_final = this.calcularFechaFinal("dia");

    const result = await this.corteRepository.obtenerTotalCortes(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener el resumen total por día.");
    }

    return result;
  }

  async obtenerResumenTotalSemana() {
    const fecha_inicio = this.calcularFechaInicio("semana");
    const fecha_final = this.calcularFechaFinal("semana");

    const result = await this.corteRepository.obtenerTotalCortes(
      fecha_inicio,
      fecha_final,
    );

    if (!result) {
      throw new Error("Error al obtener el resumen total por semana.");
    }

    return result;
  }

  async obtenerResumenTotalMes(mes: number) {
    const fecha_inicio = this.calcularFechaInicio("mes", mes);
    const fecha_final = this.calcularFechaFinal("mes", mes);

    const result = await this.corteRepository.obtenerTotalCortes(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener el resumen total por mes.");
    }

    return result;
  }

  async obtenerCortesPorDia() {
    const fecha_inicio = this.calcularFechaInicio("dia");
    const fecha_final = this.calcularFechaFinal("dia");

    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener los cortes por día.");
    }

    return result;
  }

  async obtenerCortesPorSemanaActual() {
    const fecha_inicio = this.calcularFechaInicio("semana");
    const fecha_final = this.calcularFechaFinal("semana");

    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );

    if (!result) {
      throw new Error("Error al obtener los cortes por semana actual.");
    }

    return result;
  }

  async obtenerTodosLosCortesPorMes(mes: number) {
    const fecha_inicio = this.calcularFechaInicio("mes", mes);
    const fecha_final = this.calcularFechaFinal("mes", mes);

    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes por mes.");
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

    const [anioFin, mesFin, diaFin] = fecha_final_string.split("-").map(Number);
    const fecha_final = new Date(anioFin, mesFin - 1, diaFin, 23, 59, 59, 999);

    const result = await this.corteRepository.obtenerTodosLosCortesPorFecha(
      fecha_inicio,
      fecha_final,
    );
    if (!result) {
      throw new Error("Error al obtener todos los cortes por rango de fechas.");
    }

    return result;
  }

  // METODOS PRIVADOS

  private calcularComisionBarbero(
    montoCorte: Decimal,
    comisionBarbero: Decimal,
  ) {
    let comision = new Decimal(montoCorte).mul(comisionBarbero).div(100);

    return comision;
  }

  private calcularMontoBarberia(montoCorte: Decimal, comisionBarbero: Decimal) {
    let monto = new Decimal(montoCorte).minus(comisionBarbero);

    return monto;
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

  private calcularFechaInicio(dia: string, mes?: number) {
    const fecha_inicio = new Date();

    switch (dia) {
      case "dia":
        fecha_inicio.setHours(0, 0, 0, 0);
        break;
      case "semana":
        let diaDeSemana = fecha_inicio.getDay();
        let diaInicioSemana = fecha_inicio.getDate() - diaDeSemana;
        fecha_inicio.setDate(diaInicioSemana);
        fecha_inicio.setHours(0, 0, 0, 0);
        break;
      case "mes":
        if (mes !== undefined) {
          fecha_inicio.setMonth(mes);
        }
        fecha_inicio.setDate(1);
        fecha_inicio.setHours(0, 0, 0, 0);
        break;
    }

    return fecha_inicio;
  }

  private calcularFechaFinal(dia: string, mes?: number) {
    const fecha_final = new Date();

    switch (dia) {
      case "dia":
        fecha_final.setHours(23, 59, 59, 999);
        break;
      case "semana":
        let diasFinalSemana = this.calcularDiasFinalSemana(
          fecha_final.getDay(),
        );
        let dias = fecha_final.getDate() + diasFinalSemana;
        fecha_final.setDate(dias);
        fecha_final.setHours(23, 59, 59, 999);
        break;
      case "mes":
        if (mes !== undefined) {
          fecha_final.setMonth(mes + 1);
        }
        fecha_final.setDate(0);
        fecha_final.setHours(23, 59, 59, 999);
        break;
    }

    return fecha_final;
  }

  private calcularFechaHoy() {
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }

  private async crearRegistro(texto: string, autor: string | undefined) {
    const hora = new Date();
    const textoRegistrar = `El Usuario ${autor} a las ${hora.toLocaleString()} ha realizado: ${texto}`;

    await this.registroRepository.crearRegistro(hora, textoRegistrar);
  }

  async verificarContraseniaAdmin(nombre_usuario: string, contrasena: string) {
    const usuario =
      await this.usuarioRepository.obtenerUsuarioPorNombre(nombre_usuario);

    if (!usuario) {
      throw new Error("Credenciales inválidas");
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    console.log("Contra comparacion " + isMatch);
    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    return true;
  }

  async verificarPuedeRealizarAccion(
    horaRealizoAccion: Date | null,
    rol: string | undefined,
  ) {
    if (rol !== "SOLO_REGISTRO") {
      return true;
    }
    if (horaRealizoAccion == null) {
      return false;
    }

    const inicioHoy = this.calcularFechaHoy();

    const finHoy = new Date(inicioHoy);
    finHoy.setHours(23, 59, 59, 999);

    const fechaAccion = new Date(horaRealizoAccion);

    if (fechaAccion < inicioHoy || fechaAccion > finHoy) {
      return false;
    }

    return true;
  }
}
