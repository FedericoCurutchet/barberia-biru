import type { RolUsuario } from "./RolUsuario";

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  nombreUsuario: string;
  rol: RolUsuario;
}
