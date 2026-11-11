import { RegistroRepository } from "../repositories/registro.repository";

export class RegistroService {
  private registroRepository: RegistroRepository;

  constructor() {
    this.registroRepository = new RegistroRepository();
  }

  async obtenerTodosLosRegistros() {
    const result = await this.registroRepository.obtenerTodosLosRegistros();
    return result;
  }
}
