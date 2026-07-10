import { Livro } from '../../model/livro'
import { LivroRepository } from '../../repositories/livro-repository'

export class ListarLivrosUseCase {
  constructor(private readonly livroRepository: LivroRepository) {}

  async executar(): Promise<Livro[]> {
    return this.livroRepository.listarTodos()
  }
}
