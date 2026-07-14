import { LivroRepository } from '../../repositories/livro-repository'

export class RemoverLivroUseCase {
  constructor(private readonly livroRepository: LivroRepository) {}

  async executar(id: number): Promise<void> {
    const livroExiste = await this.livroRepository.buscarPorId(id)
    if (!livroExiste) {
      throw new Error('Livro não encontrado para remoção.')
    }

    try {
      const deletado = await this.livroRepository.remover(id)
      if (!deletado) {
        throw new Error('Não foi possível remover o livro.')
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === '23503') {
        throw new Error(
          'Não é possível remover este livro porque ele possui históricos de empréstimos associados.',
          { cause: error }
        )
      }
      throw error
    }
  }
}
