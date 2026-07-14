import { Autor } from '../../model/autor'
import { AutorRepository } from '../../repositories/autor-repository'

export class BuscarAutorUseCase {
  constructor(private readonly autorRepository: AutorRepository) {}

  async executar(id: number): Promise<Autor> {
    if (!id || id <= 0) {
      throw new Error('ID do autor inválido')
    }

    const autor = await this.autorRepository.buscarPorId(id)

    if (!autor) {
      throw new Error('Autor não encontrado.')
    }

    return autor
  }
}
