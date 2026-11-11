import { RolUsuario } from "../../generated/prisma/enums";
import { UsuarioRepository } from "../repositories/usuario.repository";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { RegistroRepository } from "../repositories/registro.repository";

const JWT_SECRET = process.env.JWT_SECRET || "Kokito24/11/25";

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;
  private registroRepository: RegistroRepository;

  constructor() {
    this.usuarioRepository = new UsuarioRepository();
    this.registroRepository = new RegistroRepository();
  }

  async crearUsuario(
    nombre: string,
    contrasena: string,
    nombre_usuario: string,
    contrasena_admin: string,
    nombre_usuario_admin?: string,
    rol?: RolUsuario,
  ) {
    if (
      !(await this.verificarContraseniaAdmin(
        nombre_usuario_admin,
        contrasena_admin,
      ))
    ) {
      throw new Error("Error datos administrador");
    }
    const contraHasheada = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = await this.usuarioRepository.crearUsuario(
      nombre,
      contraHasheada,
      nombre_usuario,
      rol,
    );

    await this.crearRegistro(
      `creado el usuario con nombre de usuario: ${nombre_usuario}`,
      nombre_usuario_admin,
    );

    return nuevoUsuario;
  }

  async obtenerUsuario(id: number | string) {
    const numericId = Number(id);
    const usuario = await this.usuarioRepository.obtenerUsuario(numericId);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }
    return usuario;
  }

  async editarUsuario(
    id: number | string,
    nombre_usuario_admin: string | undefined,
    conterasena_admin: string,
    nombre?: string,
    contrasena?: string,
    nombre_usuario?: string,
    rol?: RolUsuario,
  ) {
    if (
      !(await this.verificarContraseniaAdmin(
        nombre_usuario_admin,
        conterasena_admin,
      ))
    ) {
      throw new Error("Contraseña Admin Invalida");
    }
    const numericId = Number(id);
    let contraHasheada: string | undefined = undefined;

    if (contrasena) {
      contraHasheada = await bcrypt.hash(contrasena, 10);
    }

    const usuarioEditado = await this.usuarioRepository.editarUsuario(
      numericId,
      nombre,
      contraHasheada,
      nombre_usuario,
      rol,
    );

    await this.crearRegistro(
      `editado el usuario con ID: ${numericId}`,
      nombre_usuario_admin,
    );

    return usuarioEditado;
  }

  async login(nombre_usuario: string, contrasena: string) {
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

    const token = jwt.sign(
      {
        userId: Number(usuario.id),
        username: usuario.nombreUsuario,
        rol: usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    console.log("Token generado exitosamente:", token);

    return { token };
  }

  async borrarUsuario(
    id: number | string,
    nombre_usuario: string | undefined,
    contrasena: string,
  ) {
    if (!(await this.verificarContraseniaAdmin(nombre_usuario, contrasena))) {
      throw new Error("Contraseña Admin Invalida");
    }
    const numericId = Number(id);
    const usuarioBorrado =
      await this.usuarioRepository.borrarUsuario(numericId);

    await this.crearRegistro(
      `borrado el usuario con ID: ${numericId}`,
      nombre_usuario,
    );

    return usuarioBorrado;
  }

  async obtenerTodosLosUsuarios() {
    return await this.usuarioRepository.obtenerTodosLosUsuarios();
  }

  async verificarContraseniaAdmin(
    nombre_usuario: string | undefined,
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

  private async crearRegistro(texto: string, autor: string | undefined) {
    const hora = new Date();
    const textoRegistrar = `El Usuario ${autor} a las ${hora.toLocaleString()} ha realizado: ${texto}`;

    await this.registroRepository.crearRegistro(hora, textoRegistrar);
  }
}
