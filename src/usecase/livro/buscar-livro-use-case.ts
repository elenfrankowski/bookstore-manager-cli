import { Livro } from '../../model/livro'
import { LivroRepository } from '../../repositories/livro-repository'

export class BuscarLivroUseCase {
  constructor(private readonly livroRepository: LivroRepository) {}

  async executar(id: number): Promise<Livro> {
    if (!id || id <= 0) {
      throw new Error('ID do livro inválido')
    }

    const livro = await this.livroRepository.buscarPorId(id)
    if (!livro) {
      throw new Error('Livro não encontrado')
    }

    return livro
  }
}
