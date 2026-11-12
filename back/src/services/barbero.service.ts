import Decimal from "decimal.js";
import { BarberoRepository } from "../repositories/barbero.repository";
import { RegistroRepository } from "../repositories/registro.repository";
import { UsuarioRepository } from "../repositories/usuario.repository";
import bcrypt from "bcryptjs";
// import { RegistroRepository } from "../repositories/registro.repository";

export class BarberoService {
  private barberoRepository: BarberoRepository;
  private registroRepository: RegistroRepository;
  private usuarioRepository: UsuarioRepository;
  constructor() {
    this.barberoRepository = new BarberoRepository();
    this.registroRepository = new RegistroRepository();
    this.usuarioRepository = new UsuarioRepository();
  }

  async crearBarbero(
    nombre: string,
    comision: Decimal,

    contrasena_admin: string,
    nombre_usuario_admin?: string,
  ) {
    await this.verificarContraseniaAdmin(
      nombre_usuario_admin,
      contrasena_admin,
    );
    const result = await this.barberoRepository.crearBarbero(nombre, comision);

    if (!result) {
      throw new Error("Error al crear el barbero.");
    }

    await this.crearRegistro(
      `Creación del barbero "${nombre}" con comisión ${comision.toString()}`,
      nombre_usuario_admin,
    );

    return result;
  }

  async obtenerBarbero(id: number) {
    const result = await this.barberoRepository.obtenerBarbero(id);
    if (!result) {
      throw new Error("Error al obtener el barbero.");
    }

    return result;
  }

  async editarBarbero(
    id: number,
    nombre_usuario_admin: string | undefined,
    contrasena_admin: string,
    activo?: boolean,
    nombre?: string,
    comision?: Decimal,
  ) {
    await this.verificarContraseniaAdmin(
      nombre_usuario_admin,
      contrasena_admin,
    );
    const result = await this.barberoRepository.editarBarbero(
      id,
      activo,
      nombre,
      comision,
    );

    if (!result) {
      throw new Error(`Error al editar el barbero con ID ${id}.`);
    }

    const cambios: string[] = [];
    if (nombre !== undefined) cambios.push(`nombre a "${nombre}"`);
    if (comision !== undefined)
      cambios.push(`comisión a ${comision.toString()}`);
    if (activo !== undefined) cambios.push(`estado activo a ${activo}`);

    const detalleCambios =
      cambios.length > 0 ? cambios.join(", ") : "sin cambios especificados";
    await this.crearRegistro(
      `Edición del barbero ID ${id}: se modificó ${detalleCambios}`,
      nombre_usuario_admin,
    );

    return result;
  }

  async borrarBarbero(
    id: number,
    nombre_usuario_admin: string | undefined,
    contrasena_admin: string,
  ) {
    await this.verificarContraseniaAdmin(
      nombre_usuario_admin,
      contrasena_admin,
    );
    const result = await this.barberoRepository.borrarBarbero(id);

    if (!result) {
      throw new Error("Error al borrar el barbero.");
    }

    await this.crearRegistro(
      `Eliminación del barbero con ID ${id}`,
      nombre_usuario_admin,
    );

    return result;
  }

  async obtenerBarberosActivos() {
    const result = await this.barberoRepository.obtenerBarberosActivos();
    if (!result) {
      throw new Error("Error al obtener los barberos.");
    }

    return result;
  }

  async obtenerTodosLosBarberos() {
    const result = await this.barberoRepository.obtenerTodosLosBarberos();
    if (!result) {
      throw new Error("Error al obtener los barberos.");
    }

    return result;
  }

  private async crearRegistro(texto: string, autor: string | undefined) {
    const hora = new Date();
    const textoRegistrar = `El Usuario ${autor} a las ${hora.toLocaleString()} ha realizado: ${texto}`;

    await this.registroRepository.crearRegistro(hora, textoRegistrar);
  }

  async verificarContraseniaAdmin(
    nombre_usuario: string | undefined,
    contrasena: string,
  ) {
    if (!nombre_usuario) {
      throw new Error("Credenciales inválidas");
    }

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
}
