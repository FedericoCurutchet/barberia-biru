import { type Request, type Response } from "express";

import { RegistroService } from "../services/registro.service";

const registroService = new RegistroService();

export class RegistroController {
  constructor() {}

  public obtenerRegistros = async (req: Request, res: Response) => {
    try {
      const registros = await registroService.obtenerTodosLosRegistros();

      return res.status(200).json(registros);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al obtener los registros" });
    }
  };
}
