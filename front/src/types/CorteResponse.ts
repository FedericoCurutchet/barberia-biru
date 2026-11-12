export interface CorteResponse {
  id: number;
  cliente: string;
  monto: number;
  montoBarberia: number;
  comisionBarbero: number;
  metodoPago: string;
  hora: Date;
  propina: number;
  barbero: {
    id: number;
    nombre: string;
  };
}
