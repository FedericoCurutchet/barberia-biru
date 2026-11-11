import { type Request, type Response } from "express";
import { BarberoService } from "../services/barbero.service";
import { UserPayload } from "../types/express";

const barberoService = new BarberoService();

export class BarberoController {
  constructor() {}

  public crearBarbero = async (req: Request, res: Response) => {
    try {
      const { nombre, comision, contrasena_admin } = req.body;
      const barbero = await barberoService.crearBarbero(
        nombre,
        comision,
        contrasena_admin,
        req.user?.username,
      );

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
      const { id, nombre, activo, comision, contrasena_admin } = req.body;
      const barbero = await barberoService.editarBarbero(
        id,
        req.user?.username,
        contrasena_admin,
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
      const { id, contrasena_admin } = req.body;
      const barbero = await barberoService.borrarBarbero(
        id,
        req.user?.username,
        contrasena_admin,
      );

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
