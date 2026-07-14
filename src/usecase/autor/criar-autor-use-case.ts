import { Autor } from '../../model/autor'
import { AutorRepository } from '../../repositories/autor-repository'

export class CriarAutorUseCase {
  constructor(private readonly autorRepository: AutorRepository) {}

  async executar(nome: string): Promise<Autor> {
    const nomeFormatado = nome.trim()

    if (!nomeFormatado) {
      throw new Error('O nome do autor é obrigatório e não pode ser vazio')
    }

    const autorExistente =
      await this.autorRepository.buscarPorNome(nomeFormatado)
    if (autorExistente) {
      throw new Error('Já existe um autor cadastrado com esse nome')
    }

    return this.autorRepository.criar({ nome: nomeFormatado })
  }
}
