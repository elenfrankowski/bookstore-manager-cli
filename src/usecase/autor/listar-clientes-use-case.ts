import { Cliente } from '../../model/cliente'
import { ClienteRepository } from '../../repositories/cliente-repository'

export class ListarClientesUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async executar(): Promise<Cliente[]> {
    return this.clienteRepository.listarTodos()
  }
}
