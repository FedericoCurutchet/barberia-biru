export interface CorteItem {
  id: number;
  cliente: string;
  monto: number;
  montoBarberia: number;
  comisionBarbero: number;
  metodoPago: string;
  hora: Date;
  propina: number;
  barbero: {
    nombre: string;
    id: number;
  };
}
