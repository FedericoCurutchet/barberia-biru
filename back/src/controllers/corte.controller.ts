import { type Request, type Response } from "express";
import { CorteService } from "../services/corte.service";

const corteService = new CorteService();

export class CorteController {
  constructor() {}

  public crearCorte = async (req: Request, res: Response) => {
    try {
      const { cliente, monto, barberoId, metodoPago, hora } = req.body;

      // Obtenemos el usuario administrador logueado desde el token
      const nombreUsuarioAdmin = req.user?.username;

      const corte = await corteService.crearCorte(
        cliente,
        monto,
        barberoId,
        metodoPago,
        hora ? new Date(hora) : undefined,
        nombreUsuarioAdmin,
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
      // Usualmente el ID viaja por params (/api/corte/:id) o body, ajustado según tu preferencia
      const { id } = req.body;
      const corte = await corteService.obtenerCorte(Number(id));
      return res.status(200).json(corte);
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({
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
      } = req.body;

      // Extraemos el rol y el username del admin desde el token decodificado (req.user)
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

      // Extraemos el rol y el username del admin desde el token decodificado (req.user)
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
          message: error.message || "Hubo un error al buscar el resumen",
        });
    }
  };
}
