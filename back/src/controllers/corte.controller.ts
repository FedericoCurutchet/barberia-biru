import { type Request, type Response } from "express";
import { CorteService } from "../services/corte.service";
import { UserPayload } from "../types/express";

const corteService = new CorteService();

export class CorteController {
  constructor() {}

  public crearCorte = async (req: Request, res: Response) => {
    try {
      const { cliente, monto, barberoId, metodoPago, hora, propina } = req.body;

      const nombreUsuarioAdmin = req.user?.username;

      const corte = await corteService.crearCorte(
        cliente,
        monto,
        barberoId,
        metodoPago,
        hora ? new Date(hora) : undefined,
        nombreUsuarioAdmin,
        propina,
      );
      return res.status(200).json(corte);
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error.message || "Hubo un error al crear el corte" });
    }
  };

  public obtenerCorte = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const corte = await corteService.obtenerCorte(Number(id));
      return res.status(200).json(corte);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al obtener el corte",
      });
    }
  };

  public editarCorte = async (req: Request, res: Response) => {
    try {
      const {
        id,
        cliente,
        monto,
        montoBarberia,
        comisionBarbero,
        barberoId,
        hora,
        metodoPago,
        propina,
      } = req.body;

      const rolUsuario = req.user?.rol;
      const nombreUsuarioAdmin = req.user?.username;

      const corte = await corteService.editarCorte(
        Number(id),
        cliente,
        monto,
        montoBarberia,
        comisionBarbero,
        barberoId ? Number(barberoId) : undefined,
        hora,
        metodoPago,
        nombreUsuarioAdmin,
        rolUsuario,
        propina,
      );
      return res.status(200).json(corte);
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error.message || "Hubo un error al editar el corte" });
    }
  };

  public borrarCorte = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      const rolUsuario = req.user?.rol;
      const nombreUsuarioAdmin = req.user?.username;

      const corte = await corteService.borrarCorte(
        Number(id),
        nombreUsuarioAdmin,
        rolUsuario,
      );
      return res.status(200).json(corte);
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error.message || "Hubo un error al borrar el corte" });
    }
  };

  public obtenerResumenBarbero = async (req: Request, res: Response) => {
    try {
      const { fecha_inicio, fecha_final } = req.query;
      const resumen = await corteService.obtenerResumenBarbero(
        String(fecha_inicio),
        String(fecha_final),
      );

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenTotal = async (req: Request, res: Response) => {
    try {
      const { fecha_inicio, fecha_final } = req.query;
      const resumen = await corteService.obtenerResumenTotal(
        String(fecha_inicio),
        String(fecha_final),
      );

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerTodosLosCortes = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerTotalCortes();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerTodosLosCortesPorFecha = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { fecha_inicio, fecha_final } = req.query;
      const resumen = await corteService.obtenerTodosLosCortesPorFecha(
        String(fecha_inicio),
        String(fecha_final),
      );

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerCortesPorDia = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerCortesPorDia();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerCortesPorSemanaActual = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerCortesPorSemanaActual();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerTodosLosCortesPorMes = async (req: Request, res: Response) => {
    try {
      const { mes } = req.query;
      const resumen = await corteService.obtenerTodosLosCortesPorMes(
        Number(mes),
      );

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenBarberoDia = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerResumenBarberoDia();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenBarberoSemana = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerResumenBarberoSemana();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenBarberoMes = async (req: Request, res: Response) => {
    try {
      const { mes } = req.query;
      const resumen = await corteService.obtenerResumenBarberoMes(Number(mes));

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenTotalDia = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerResumenTotalDia();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenTotalSemana = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerResumenTotalSemana();

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerResumenTotalMes = async (req: Request, res: Response) => {
    try {
      const { mes } = req.query;
      const resumen = await corteService.obtenerResumenTotalMes(Number(mes));

      return res.status(200).json(resumen);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el resumen",
      });
    }
  };

  public obtenerPrecioCorte = async (req: Request, res: Response) => {
    try {
      const precioCorte = await corteService.obtenerPrecioCorteActivo();
      return res.status(200).json(precioCorte);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Hubo un error al buscar el precio del corte",
      });
    }
  };

  public pdfResumenMensual = async (req: Request, res: Response) => {
    try {
      const mes = Number(req.query.mes);
      if (isNaN(mes) || mes < 0 || mes > 11) {
        return res
          .status(400)
          .json({ error: "Mes inválido (debe ser de 0 a 11)" });
      }

      await corteService.generarPdfResumenMensual(mes, res);
    } catch (error: any) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al generar el PDF del resumen mensual" });
    }
  };

  public pdfResumenMensualBarbero = async (req: Request, res: Response) => {
    try {
      const idBarbero = Number(req.params.idBarbero);
      const mes = Number(req.params.mes);

      if (isNaN(mes) || mes < 0 || mes > 11) {
        return res
          .status(400)
          .json({ error: "Mes inválido (debe ser de 0 a 11)" });
      }

      await corteService.generarPdfResumenBarberoMensual(idBarbero, mes, res);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: "Error al generar el PDF del resumen mensual del barbero",
      });
    }
  };
}
