import { AutorRepository } from '../../repositories/autor-repository'

export class RemoverAutorUseCase {
  constructor(private readonly autorRepository: AutorRepository) {}

  async executar(id: number): Promise<void> {
    const autorExiste = await this.autorRepository.buscarPorId(id)
    if (!autorExiste) {
      throw new Error('Autor não encontrado para remoção.')
    }

    try {
      const deletado = await this.autorRepository.remover(id)
      if (!deletado) {
        throw new Error('Não foi possível remover o autor.')
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23503') {
        throw new Error(
          'Não é possível remover um autor que possui livros cadastrados.',
          {
            cause: error
          }
        )
      }
      throw error
    }
  }
}
