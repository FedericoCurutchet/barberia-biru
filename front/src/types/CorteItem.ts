export interface CorteItem {
  id: number;
  cliente: string;
  monto: number;
  montoBarberia: number;
  comisionBarbero: number;
  metodoPago: string;
  hora: Date;
  barbero: {
    nombre: string;
    id: number;
  };
}
