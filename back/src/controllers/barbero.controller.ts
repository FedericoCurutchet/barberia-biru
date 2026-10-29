import { type Request, type Response } from "express";
import { BarberoRepository } from "../repositories/barbero.repository";
import { BarberoService } from "../services/barbero.service";
import { RegistroRepository } from "../repositories/registro.repository";

const barberoRepository = new BarberoRepository();
const registroRepository = new RegistroRepository();
const barberoService = new BarberoService(
  barberoRepository,
  registroRepository,
);

export class BarberoController {
  constructor() {}

  public crearBarbero = async (req: Request, res: Response) => {
    try {
      const { nombre, comision } = req.body;
      const barbero = await barberoService.crearBarbero(nombre, comision);

      return res.status(200).json(barbero);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al crear al barbero" });
    }
  };

  public obtenerBarbero = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const barbero = await barberoService.obtenerBarbero(id);

      return res.status(200).json(barbero);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al obtener al barbero" });
    }
  };
  public editarBarbero = async (req: Request, res: Response) => {
    try {
      const { id, nombre, activo, comision } = req.body;
      const barbero = await barberoService.editarBarbero(
        id,
        activo,
        nombre,
        comision,
      );

      return res.status(200).json(barbero);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al editar al barbero" });
    }
  };

  public borrarBarbero = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const barbero = await barberoService.borrarBarbero(id);

      return res.status(200).json(barbero);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Hubo un error al borrar al barbero" });
    }
  };

  public obtenerBarberosActivos = async (req: Request, res: Response) => {
    try {
      const barberos = await barberoService.obtenerBarberosActivos();

      return res.status(200).json(barberos);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al obtener los barberos." });
    }
  };

  public obtenerTodosLosBarberos = async (req: Request, res: Response) => {
    try {
      const barberos = await barberoService.obtenerTodosLosBarberos();

      return res.status(200).json(barberos);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Hubo un error al obtener los barberos." });
    }
  };
}
