import { type Request, type Response } from "express";
import { CorteRepository } from "../repositories/corte.repository";
import { CorteService } from "../services/corte.service";

const corteRepository = new CorteRepository();
const corteSerice = new CorteService(corteRepository);

export class CorteController {
  constructor() {}

  public crearCorte = async (req: Request, res: Response) => {
    try {
      const { cliente, monto, tipoCorteId, barberoId, hora } = req.body;
      const corte = await corteSerice.crearCorte(
        cliente,
        monto,
        tipoCorteId,
        barberoId,
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
      const corte = await corteSerice.obtenerCorte(id);
      return res.status(200).json(corte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al obtener el corte" });
    }
  };

  public editarCorte = async (req: Request, res: Response) => {
    try {
      const { id, cliente, monto, tipoCorteId, barberoId, hora } = req.body;

      const corte = await corteSerice.edtiarCorte(
        id,
        cliente,
        monto,
        tipoCorteId,
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
      const corte = await corteSerice.borrarCorte(id);
      return res.status(200).json(corte);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al borrar el corte" });
    }
  };
}
