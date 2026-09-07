import { type Request, type Response } from "express";
import { TipoCorteRepository } from "../repositories/tipoCorte.repositry";
import { TipoCorteService } from "../services/tipoCorte.service";

const tipoCorteRepository = new TipoCorteRepository();
const tipoCorteService = new TipoCorteService(tipoCorteRepository);
export class TipoCorteController {
  constructor() {}

  public crearTipoCorte = async (req: Request, res: Response) => {
    try {
      const { nombre } = req.body;
      const tipoCorte = tipoCorteService.crearTipoCorte(nombre);

      return res.status(200).json(tipoCorte);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al crear el Tipo de Corte" });
    }
  };

  public obtenerTipoCorte = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const tipoCorte = tipoCorteService.obtenerTipoCorte(id);

      return res.status(200).json(tipoCorte);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al obtener el Tipo de Corte" });
    }
  };

  public editarTipoCorte = async (req: Request, res: Response) => {
    try {
      const { id, nombre, activo } = req.body;
      const tipoCorte = tipoCorteService.editarTipoCorte(id, nombre, activo);

      return res.status(200).json(tipoCorte);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al editar el Tipo de Corte" });
    }
  };

  public borrarTipoCorte = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const tipoCorte = tipoCorteService.borrarTipoCorte(id);

      return res.status(200).json(tipoCorte);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al borrar el Tipo de Corte" });
    }
  };
}
