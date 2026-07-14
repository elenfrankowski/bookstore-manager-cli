import { ClienteRepository } from '../../repositories/cliente-repository'

export class RemoverClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async executar(id: number): Promise<void> {
    const clienteExiste = await this.clienteRepository.buscarPorId(id)
    if (!clienteExiste) {
      throw new Error('Cliente não encontrado para remoção.')
    }

    try {
      const deletado = await this.clienteRepository.remover(id)
      if (!deletado) {
        throw new Error('Não foi possível remover o cliente.')
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23503') {
        throw new Error(
          'Não é possível remover um cliente que possui históricos de empréstimos registrados.',
          { cause: error }
        )
      }
      throw error
    }
  }
}
