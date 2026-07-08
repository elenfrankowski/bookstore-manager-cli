import { Autor } from '../../model/autor'
import { AutorRepository } from '../../repositories/autor-repository'

export class ListarAutoresUseCase {
  constructor(private readonly autorRepository: AutorRepository) {}

  async executar(): Promise<Autor[]> {
    return this.autorRepository.listarTodos()
  }
}
