import { Autor } from '../../model/autor'
import { AutorRepository } from '../../repositories/autor-repository'

export class AtualizarAutorUseCase {
  constructor(private readonly autorRepository: AutorRepository) {}

  async executar(id: number, novoNome: string): Promise<Autor> {
    const nomeFormatado = novoNome.trim()

    if (!nomeFormatado) {
      throw new Error('O novo nome do autor não pode ser vazio.')
    }

    const autorExiste = await this.autorRepository.buscarPorId(id)
    if (!autorExiste) {
      throw new Error('Autor não encontrado para atualização')
    }

    const nomeDuplicado =
      await this.autorRepository.buscarPorNome(nomeFormatado)
    if (nomeDuplicado && nomeDuplicado.id !== id) {
      throw new Error('Já existe outro autor cadastrado com esse nome.')
    }

    const autorAtualizado = await this.autorRepository.atualizar(
      id,
      nomeFormatado
    )
    if (!autorAtualizado) {
      throw new Error('Não foi possível atualizar o autor.')
    }

    return autorAtualizado
  }
}
