import Decimal from "decimal.js";
import PDFDocument from "pdfkit";
import { Response } from "express";
import { CorteRepository } from "../repositories/corte.repository";
import { BarberoService } from "./barbero.service";
import { RegistroRepository } from "../repositories/registro.repository";
import { UsuarioRepository } from "../repositories/usuario.repository";
import bcrypt from "bcryptjs";
import { PrecioCorteRepositry } from "../repositories/preciocorte.repository";

export class CorteService {
  private corteRepository: CorteRepository;
  private registroRepository: RegistroRepository;
  private barberoService: BarberoService;
  private usuarioRepository: UsuarioRepository;
  private precioCorteRepositroy: PrecioCorteRepositry;
  constructor() {
    this.corteRepository = new CorteRepository();
    this.registroRepository = new RegistroRepository();
    this.barberoService = new BarberoService();
    this.usuarioRepository = new UsuarioRepository();
    this.precioCorteRepositroy = new PrecioCorteRepositry();
  }

  // CRUD

  async crearCorte(
    cliente: string,
    monto: Decimal,
    barberoId: number,
    metodoPago: string,
    hora?: Date,
    nombre_usuario_admin?: string,
    propina?: Decimal,
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
      propina,
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
    propina?: Decimal,
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
      propina,
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

  async obtenerPrecioCorteActivo() {
    const result = await this.precioCorteRepositroy.obtenerPrecioCorteActivo();
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

  private async calcularMontoSinPropina(montoRecibido: Decimal) {
    const precioCorte =
      await this.precioCorteRepositroy.obtenerPrecioCorteActivo();

    if (precioCorte) {
      const montoSinPropina = new Decimal(montoRecibido).minus(
        new Decimal(precioCorte.monto),
      );
      return montoSinPropina;
    }
  }

  private async crearRegistro(texto: string, autor: string | undefined) {
    const hora = new Date();
    const textoRegistrar = `El Usuario ${autor} a las ${hora.toLocaleString()} ha realizado: ${texto}`;

    await this.registroRepository.crearRegistro(hora, textoRegistrar);
  }

  private async verificarContraseniaAdmin(
    nombre_usuario: string,
    contrasena: string,
  ) {
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

  private async verificarPuedeRealizarAccion(
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

  async generarPdfResumenBarberoMensual(
    barberoId: number,
    mes: number,
    res: Response,
  ) {
    const mesesNombres = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const nombreMes = mesesNombres[mes] || "Mes";
    const anioActual = new Date().getFullYear();

    const barbero = await this.barberoService.obtenerBarbero(barberoId);
    if (!barbero) {
      throw new Error("No se encontró al barbero");
    }

    const fechaInicioMes = this.calcularFechaInicio("mes", mes);
    const fechaFinalMes = this.calcularFechaFinal("mes", mes);

    const todosLosCortesBarbero =
      await this.corteRepository.obtenerCortesBarbero(barberoId);
    const cortesDelMes = todosLosCortesBarbero.filter((c: any) => {
      const horaCorte = new Date(c.hora);
      return horaCorte >= fechaInicioMes && horaCorte <= fechaFinalMes;
    });

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Resumen_Barbero_${barbero.nombre.replace(/\s+/g, "_")}_${nombreMes}.pdf`,
    );
    doc.pipe(res);

    const colorDark = "#0f172a";
    const colorMuted = "#64748b";
    const colorLightBg = "#f8fafc";
    const colorBorder = "#e2e8f0";
    const colorPrimary = "#4f46e5";

    doc
      .fillColor(colorDark)
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(`Reporte Mensual - ${barbero.nombre}`, { align: "left" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(colorMuted)
      .text(
        `Período: ${nombreMes} ${anioActual} | Comisión: ${barbero.comision}% - Generado el ${new Date().toLocaleDateString()}`,
        { align: "left" },
      );
    doc.moveDown(1.5);

    let totalCortesMes = cortesDelMes.length;
    let montoBrutoMes = 0;
    let comisionTotalMes = 0;
    let propinaTotalMes = 0;

    cortesDelMes.forEach((c: any) => {
      montoBrutoMes += Number(c.monto ?? 0);
      comisionTotalMes += Number(c.comisionBarbero ?? 0);
      propinaTotalMes += Number(c.propina ?? 0);
    });

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Resumen General del Mes");
    doc.moveDown(0.5);

    let startY = doc.y;
    doc
      .roundedRect(40, startY, 515, 60, 6)
      .fillAndStroke(colorLightBg, colorBorder);

    doc.fontSize(9).font("Helvetica-Bold").fillColor(colorMuted);
    doc.text("TOTAL CORTES", 55, startY + 12);
    doc.text("MONTO BRUTO", 185, startY + 12);
    doc.text("COMISIÓN TOTAL", 315, startY + 12);
    doc.text("PROPINAS TOTALES", 445, startY + 12);

    doc.fontSize(12).font("Helvetica-Bold").fillColor(colorDark);
    doc.text(String(totalCortesMes), 55, startY + 28);
    doc.text(`$${montoBrutoMes.toLocaleString("de-DE")}`, 185, startY + 28);
    doc
      .fillColor(colorPrimary)
      .text(`$${comisionTotalMes.toLocaleString("de-DE")}`, 315, startY + 28);
    doc
      .fillColor("#d97706")
      .text(`$${propinaTotalMes.toLocaleString("de-DE")}`, 445, startY + 28);

    doc.y = startY + 75;
    doc.moveDown(1.5);

    const primerDiaMes = new Date(anioActual, mes, 1);
    const ultimoDiaMes = new Date(anioActual, mes + 1, 0);
    const semanas: { inicio: Date; fin: Date; titulo: string }[] = [];

    let inicioSemana = new Date(primerDiaMes);
    let numeroSemana = 1;

    while (inicioSemana <= ultimoDiaMes) {
      let finSemana = new Date(inicioSemana);
      finSemana.setDate(finSemana.getDate() + 6);
      if (finSemana > ultimoDiaMes) {
        finSemana = new Date(ultimoDiaMes);
      }

      semanas.push({
        inicio: new Date(inicioSemana),
        fin: new Date(finSemana),
        titulo: `Semana ${numeroSemana} (${inicioSemana.getDate()} al ${finSemana.getDate()} de ${nombreMes})`,
      });

      inicioSemana.setDate(inicioSemana.getDate() + 7);
      numeroSemana++;
    }

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Detalle de Cortes por Semana");
    doc.moveDown(0.5);

    let currentY = doc.y;

    semanas.forEach((sem) => {
      if (currentY > 670) {
        doc.addPage();
        currentY = 40;
      }

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(colorPrimary)
        .text(sem.titulo, 40, doc.y, { align: "left" });
      doc.moveDown(0.3);

      const cortesSemana = cortesDelMes.filter((c: any) => {
        const fechaCorte = new Date(c.hora);
        return fechaCorte >= sem.inicio && fechaCorte <= sem.fin;
      });

      let tableTop = doc.y;
      doc.rect(40, tableTop, 515, 20).fill("#334155");
      doc.fillColor("#ffffff").fontSize(8).font("Helvetica-Bold");
      doc.text("Fecha / Hora", 45, tableTop + 6, { width: 100 });
      doc.text("Cliente", 150, tableTop + 6, { width: 140 });
      doc.text("Método Pago", 295, tableTop + 6, { width: 90 });
      doc.text("Monto", 390, tableTop + 6, { width: 80, align: "right" });
      doc.text("Propina", 475, tableTop + 6, { width: 75, align: "right" });

      currentY = tableTop + 20;

      let semanaMontoTotal = 0;
      let semanaComisionTotal = 0;
      let semanaPropinaTotal = 0;

      if (cortesSemana.length > 0) {
        cortesSemana.forEach((c: any, cIndex: number) => {
          if (currentY > 730) {
            doc.addPage();
            currentY = 40;
          }

          semanaMontoTotal += Number(c.monto ?? 0);
          semanaComisionTotal += Number(c.comisionBarbero ?? 0);
          semanaPropinaTotal += Number(c.propina ?? 0);

          const bgRow = cIndex % 2 === 0 ? "#ffffff" : colorLightBg;
          doc.rect(40, currentY, 515, 18).fill(bgRow);

          const fechaFormateada = new Date(c.hora).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          doc.fillColor(colorDark).fontSize(8).font("Helvetica");
          doc.text(fechaFormateada, 45, currentY + 5, { width: 100 });
          doc.text(c.cliente || "General", 150, currentY + 5, { width: 140 });
          doc.text(c.metodoPago || "-", 295, currentY + 5, { width: 90 });
          doc.text(
            `$${Number(c.monto ?? 0).toLocaleString("de-DE")}`,
            390,
            currentY + 5,
            { width: 80, align: "right" },
          );
          doc
            .fillColor("#d97706")
            .text(
              `$${Number(c.propina ?? 0).toLocaleString("de-DE")}`,
              475,
              currentY + 5,
              { width: 75, align: "right" },
            );

          doc
            .strokeColor(colorBorder)
            .lineWidth(0.5)
            .moveTo(40, currentY + 18)
            .lineTo(555, currentY + 18)
            .stroke();
          currentY += 18;
        });
      } else {
        doc.rect(40, currentY, 515, 20).fill("#ffffff");
        doc.fillColor(colorMuted).fontSize(8).font("Helvetica-Oblique");
        doc.text("No se registraron cortes en esta semana.", 45, currentY + 6);
        currentY += 20;
      }

      doc.rect(40, currentY, 515, 20).fill("#f1f5f9");
      doc.fontSize(8).font("Helvetica-Bold").fillColor(colorDark);
      doc.text(
        `Total ${sem.titulo.split(" ")[0]} ${sem.titulo.split(" ")[1]}:`,
        50,
        currentY + 6,
        { width: 300 },
      );
      doc.text(
        `Monto: $${semanaMontoTotal.toLocaleString("de-DE")}`,
        320,
        currentY + 6,
        { width: 80, align: "right" },
      );
      doc.text(
        `Comisión: $${semanaComisionTotal.toLocaleString("de-DE")}`,
        405,
        currentY + 6,
        { width: 80, align: "right" },
      );
      doc
        .fillColor("#d97706")
        .text(
          `Prop: $${semanaPropinaTotal.toLocaleString("de-DE")}`,
          490,
          currentY + 6,
          { width: 60, align: "right" },
        );

      currentY += 26;
      doc.y = currentY;
      doc.moveDown(0.5);
    });

    if (doc.y > 650) {
      doc.addPage();
    }

    doc.moveDown(1);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Consolidado Mensual del Barbero");
    doc.moveDown(0.5);

    startY = doc.y;
    doc
      .roundedRect(40, startY, 515, 50, 6)
      .fillAndStroke(colorLightBg, colorBorder);

    doc.fontSize(8.5).font("Helvetica-Bold").fillColor(colorMuted);
    doc.text("TOTALES ACUMULADOS DEL MES", 55, startY + 10);

    doc.fontSize(10).font("Helvetica").fillColor(colorDark);
    doc.text(`• Total Cortes: ${totalCortesMes}`, 55, startY + 26);
    doc.text(
      `• Bruto: $${montoBrutoMes.toLocaleString("de-DE")}`,
      170,
      startY + 26,
    );
    doc
      .fillColor(colorPrimary)
      .text(
        `• Comisión: $${comisionTotalMes.toLocaleString("de-DE")}`,
        285,
        startY + 26,
      );
    doc
      .fillColor("#d97706")
      .text(
        `• Propinas: $${propinaTotalMes.toLocaleString("de-DE")}`,
        425,
        startY + 26,
      );

    doc.fontSize(8).font("Helvetica").fillColor(colorMuted);
    doc.text(
      `Sistema de Gestión de Barbería — Reporte individual de ${barbero.nombre}.`,
      40,
      doc.page.height - 40,
      { align: "center" },
    );

    doc.end();
  }
  async generarPdfResumenMensual(mes: number, res: Response) {
    const mesesNombres = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const nombreMes = mesesNombres[mes] || "Mes";

    const anioActual = new Date().getFullYear();
    const resumenTotal = await this.obtenerResumenTotalMes(mes);
    const resumenBarberos = await this.obtenerResumenBarberoMes(mes);
    const todosLosCortes = await this.obtenerTodosLosCortesPorMes(mes);

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Resumen_Mensual_${nombreMes}.pdf`,
    );
    doc.pipe(res);

    const colorDark = "#0f172a";
    const colorMuted = "#64748b";
    const colorLightBg = "#f8fafc";
    const colorBorder = "#e2e8f0";
    const colorPrimary = "#4f46e5";

    doc
      .fillColor(colorDark)
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Reporte Mensual de Barbería", { align: "left" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(colorMuted)
      .text(
        `Período: ${nombreMes} ${anioActual} - Generado el ${new Date().toLocaleDateString()}`,
        { align: "left" },
      );
    doc.moveDown(1.5);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Resumen Global del Mes");
    doc.moveDown(0.5);

    const sumData = resumenTotal?._sum || {
      monto: 0,
      montoBarberia: 0,
      comisionBarbero: 0,
      propina: 0,
    };
    const totalMonto = Number(sumData.monto ?? 0);
    const totalBarberia = Number(sumData.montoBarberia ?? 0);
    const totalComision = Number(sumData.comisionBarbero ?? 0);
    const totalPropina = Number(sumData.propina ?? 0);

    let startY = doc.y;
    doc
      .roundedRect(40, startY, 515, 60, 6)
      .fillAndStroke(colorLightBg, colorBorder);

    doc.fontSize(9).font("Helvetica-Bold").fillColor(colorMuted);
    doc.text("INGRESOS TOTALES", 55, startY + 12);
    doc.text("MONTO BARBERÍA", 185, startY + 12);
    doc.text("COMISIONES", 315, startY + 12);
    doc.text("PROPINAS", 445, startY + 12);

    doc.fontSize(12).font("Helvetica-Bold").fillColor(colorDark);
    doc.text(`$${totalMonto.toLocaleString("de-DE")}`, 55, startY + 28);
    doc.text(`$${totalBarberia.toLocaleString("de-DE")}`, 185, startY + 28);
    doc
      .fillColor(colorPrimary)
      .text(`$${totalComision.toLocaleString("de-DE")}`, 315, startY + 28);
    doc
      .fillColor("#d97706")
      .text(`$${totalPropina.toLocaleString("de-DE")}`, 445, startY + 28);

    doc.y = startY + 75;
    doc.moveDown(1);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Rendimiento General por Barbero");
    doc.moveDown(0.5);

    let tableTop = doc.y;
    doc.rect(40, tableTop, 515, 22).fill(colorDark);
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
    doc.text("Barbero", 50, tableTop + 7, { width: 130 });
    doc.text("Cortes", 190, tableTop + 7, { width: 70, align: "center" });
    doc.text("Monto Bruto", 270, tableTop + 7, { width: 90, align: "right" });
    doc.text("Comisión", 370, tableTop + 7, { width: 90, align: "right" });
    doc.text("Propina", 470, tableTop + 7, { width: 70, align: "right" });

    let currentY = tableTop + 22;

    if (Array.isArray(resumenBarberos) && resumenBarberos.length > 0) {
      resumenBarberos.forEach((b: any, index: number) => {
        if (currentY > 730) {
          doc.addPage();
          currentY = 40;
        }

        const bgRow = index % 2 === 0 ? "#ffffff" : colorLightBg;
        doc.rect(40, currentY, 515, 22).fill(bgRow);

        doc.fillColor(colorDark).fontSize(9).font("Helvetica");
        doc.text(b.nombre || "Sin nombre", 50, currentY + 7, { width: 130 });
        doc.text(String(b.cantidadCortes ?? 0), 190, currentY + 7, {
          width: 70,
          align: "center",
        });
        doc.text(
          `$${Number(b.monto ?? 0).toLocaleString("de-DE")}`,
          270,
          currentY + 7,
          { width: 90, align: "right" },
        );
        doc.text(
          `$${Number(b.comisionBarbero ?? 0).toLocaleString("de-DE")}`,
          370,
          currentY + 7,
          { width: 90, align: "right" },
        );
        doc
          .fillColor("#d97706")
          .text(
            `$${Number(b.propina ?? 0).toLocaleString("de-DE")}`,
            470,
            currentY + 7,
            { width: 70, align: "right" },
          );

        doc
          .strokeColor(colorBorder)
          .lineWidth(0.5)
          .moveTo(40, currentY + 22)
          .lineTo(555, currentY + 22)
          .stroke();
        currentY += 22;
      });
    } else {
      doc.rect(40, currentY, 515, 25).fill("#ffffff");
      doc.fillColor(colorMuted).fontSize(9).font("Helvetica-Oblique");
      doc.text("No hay registros de barberos para este mes.", 50, currentY + 8);
      currentY += 25;
    }

    doc.moveDown(1.5);

    const primerDiaMes = new Date(anioActual, mes, 1);
    const ultimoDiaMes = new Date(anioActual, mes + 1, 0);
    const semanas: { inicio: Date; fin: Date; titulo: string }[] = [];

    let inicioSemana = new Date(primerDiaMes);
    let numeroSemana = 1;

    while (inicioSemana <= ultimoDiaMes) {
      let finSemana = new Date(inicioSemana);
      finSemana.setDate(finSemana.getDate() + 6);
      if (finSemana > ultimoDiaMes) {
        finSemana = new Date(ultimoDiaMes);
      }

      semanas.push({
        inicio: new Date(inicioSemana),
        fin: new Date(finSemana),
        titulo: `Semana ${numeroSemana} (${inicioSemana.getDate()} al ${finSemana.getDate()} de ${nombreMes})`,
      });

      inicioSemana.setDate(inicioSemana.getDate() + 7);
      numeroSemana++;
    }

    doc.addPage();

    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Desglose Detallado por Semanas");
    doc.moveDown(0.5);

    semanas.forEach((sem) => {
      if (currentY > 670) {
        doc.addPage();
        currentY = 40;
      }

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(colorPrimary)
        .text(sem.titulo, 40, doc.y, { align: "left" });
      doc.moveDown(0.3);

      const cortesSemana = todosLosCortes.filter((c: any) => {
        const fechaCorte = new Date(c.hora);
        return fechaCorte >= sem.inicio && fechaCorte <= sem.fin;
      });

      tableTop = doc.y;
      doc.rect(40, tableTop, 515, 20).fill("#334155");
      doc.fillColor("#ffffff").fontSize(8).font("Helvetica-Bold");
      doc.text("Fecha/Hora", 45, tableTop + 6, { width: 90 });
      doc.text("Barbero", 135, tableTop + 6, { width: 100 });
      doc.text("Cliente", 235, tableTop + 6, { width: 110 });
      doc.text("Método", 345, tableTop + 6, { width: 70 });
      doc.text("Monto", 415, tableTop + 6, { width: 65, align: "right" });
      doc.text("Propina", 480, tableTop + 6, { width: 70, align: "right" });

      currentY = tableTop + 20;

      let semanaMontoTotal = 0;
      let semanaPropinaTotal = 0;

      if (cortesSemana.length > 0) {
        cortesSemana.forEach((c: any, cIndex: number) => {
          if (currentY > 730) {
            doc.addPage();
            currentY = 40;
          }

          semanaMontoTotal += Number(c.monto ?? 0);
          semanaPropinaTotal += Number(c.propina ?? 0);

          const bgRow = cIndex % 2 === 0 ? "#ffffff" : colorLightBg;
          doc.rect(40, currentY, 515, 18).fill(bgRow);

          const fechaFormateada = new Date(c.hora).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          doc.fillColor(colorDark).fontSize(8).font("Helvetica");
          doc.text(fechaFormateada, 45, currentY + 5, { width: 90 });
          doc.text(c.barbero?.nombre || "N/D", 135, currentY + 5, {
            width: 100,
          });
          doc.text(c.cliente || "General", 235, currentY + 5, { width: 110 });
          doc.text(c.metodoPago || "-", 345, currentY + 5, { width: 70 });
          doc.text(
            `$${Number(c.monto ?? 0).toLocaleString("de-DE")}`,
            415,
            currentY + 5,
            { width: 65, align: "right" },
          );
          doc
            .fillColor("#d97706")
            .text(
              `$${Number(c.propina ?? 0).toLocaleString("de-DE")}`,
              480,
              currentY + 5,
              { width: 70, align: "right" },
            );

          doc
            .strokeColor(colorBorder)
            .lineWidth(0.5)
            .moveTo(40, currentY + 18)
            .lineTo(555, currentY + 18)
            .stroke();
          currentY += 18;
        });
      } else {
        doc.rect(40, currentY, 515, 20).fill("#ffffff");
        doc.fillColor(colorMuted).fontSize(8).font("Helvetica-Oblique");
        doc.text("No se registraron cortes en esta semana.", 45, currentY + 6);
        currentY += 20;
      }

      doc.rect(40, currentY, 515, 20).fill("#f1f5f9");
      doc.fontSize(8).font("Helvetica-Bold").fillColor(colorDark);
      doc.text(
        `Total ${sem.titulo.split(" ")[0]} ${sem.titulo.split(" ")[1]}:`,
        50,
        currentY + 6,
        { width: 350 },
      );
      doc.text(
        `Monto: $${semanaMontoTotal.toLocaleString("de-DE")}`,
        380,
        currentY + 6,
        { width: 100, align: "right" },
      );
      doc
        .fillColor("#d97706")
        .text(
          `Prop: $${semanaPropinaTotal.toLocaleString("de-DE")}`,
          480,
          currentY + 6,
          { width: 70, align: "right" },
        );

      currentY += 26;
      doc.y = currentY;
      doc.moveDown(0.5);
    });

    if (doc.y > 650) {
      doc.addPage();
    }

    doc.moveDown(1);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor(colorDark)
      .text("Resumen Global del Mes (Consolidado Final)");
    doc.moveDown(0.5);

    startY = doc.y;
    doc
      .roundedRect(40, startY, 515, 50, 6)
      .fillAndStroke(colorLightBg, colorBorder);

    doc.fontSize(8.5).font("Helvetica-Bold").fillColor(colorMuted);
    doc.text("TOTALES GENERALES DEL PERÍODO", 55, startY + 10);

    doc.fontSize(10).font("Helvetica").fillColor(colorDark);
    doc.text(
      `• Recaudación Bruta: $${totalMonto.toLocaleString("de-DE")}`,
      55,
      startY + 26,
    );
    doc.text(
      `• Monto Barbería: $${totalBarberia.toLocaleString("de-DE")}`,
      205,
      startY + 26,
    );
    doc.text(
      `• Comisiones: $${totalComision.toLocaleString("de-DE")}`,
      335,
      startY + 26,
    );
    doc
      .fillColor("#d97706")
      .text(
        `• Propinas: $${totalPropina.toLocaleString("de-DE")}`,
        445,
        startY + 26,
      );

    doc.fontSize(8).font("Helvetica").fillColor(colorMuted);
    doc.text(
      "Sistema de Gestión de Barbería — Reporte detallado semanal y mensual.",
      40,
      doc.page.height - 40,
      { align: "center" },
    );

    doc.end();
  }
}
