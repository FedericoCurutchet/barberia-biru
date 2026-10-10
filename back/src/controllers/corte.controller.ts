import { type Request, type Response } from "express";
import { CorteRepository } from "../repositories/corte.repository";
import { CorteService } from "../services/corte.service";
import { BarberoRepository } from "../repositories/barbero.repository";
import { BarberoSerivce } from "../services/barbero.service";

const corteRepository = new CorteRepository();
const barberoRepository = new BarberoRepository();
const barberoSerivce = new BarberoSerivce(barberoRepository);
const corteService = new CorteService(corteRepository, barberoSerivce);

export class CorteController {
  constructor() {}

  public crearCorte = async (req: Request, res: Response) => {
    try {
      const { cliente, monto, barberoId, metodoPago, hora } = req.body;
      const corte = await corteService.crearCorte(
        cliente,
        monto,
        barberoId,
        metodoPago,
        hora,
      );
      return res.status(200).json(corte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al crear el corte" });
    }
  };

  public obtenerCorte = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const corte = await corteService.obtenerCorte(id);
      return res.status(200).json(corte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al obtener el corte" });
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
      } = req.body;

      const corte = await corteService.edtiarCorte(
        id,
        cliente,
        monto,
        montoBarberia,
        comisionBarbero,
        barberoId,
        hora,
      );
      return res.status(200).json(corte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al editar el corte" });
    }
  };

  public borrarCorte = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const corte = await corteService.borrarCorte(id);
      return res.status(200).json(corte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al borrar el corte" });
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al buscar el resumen" });
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al buscar el resumen" });
    }
  };

  public obtenerTodosLosCortes = async (req: Request, res: Response) => {
    try {
      const resumen = await corteService.obtenerTotalCortes();

      return res.status(200).json(resumen);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al buscar el resumen" });
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al buscar el resumen" });
    }
  };
}
