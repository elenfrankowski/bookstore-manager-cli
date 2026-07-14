import { Cliente } from '../../model/cliente'
import { ClienteRepository } from '../../repositories/cliente-repository'

export class BuscarClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async executar(id: number): Promise<Cliente> {
    if (!id || id <= 0) {
      throw new Error('ID do cliente inválido.')
    }

    const cliente = await this.clienteRepository.buscarPorId(id)
    if (!cliente) {
      throw new Error('Cliente não encontrado')
    }

    return cliente
  }
}
