import { Livro } from '../../model/livro'
import { AutorRepository } from '../../repositories/autor-repository'
import { LivroRepository } from '../../repositories/livro-repository'

export class CriarLivroUseCase {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository
  ) {}

  async executar(
    titulo: string,
    isbn: string,
    autorId: number,
    totalExemplares: number
  ): Promise<Livro> {
    const tituloLimpo = titulo.trim()
    const isbnLimpo = isbn.trim()

    if (!tituloLimpo) {
      throw new Error('O título do livro é obrigatório.')
    }
    if (!isbnLimpo) {
      throw new Error('O ISBN do livro é obrigatório.')
    }
    if (!autorId || autorId <= 0) {
      throw new Error('ID do autor é inválido.')
    }
    if (totalExemplares < 0) {
      throw new Error('A quantidade total não pode ser negativa.')
    }

    const autorExiste = await this.autorRepository.buscarPorId(autorId)
    if (!autorExiste) {
      throw new Error(
        'Não é possível cadastrar o livro pois o autor informado não existe.'
      )
    }

    const isbnDuplicado = await this.livroRepository.buscarPorIsbn(isbnLimpo)
    if (isbnDuplicado) {
      throw new Error('Já existe um livro cadastrado com esse ISBN.')
    }

    return this.livroRepository.criar({
      titulo: tituloLimpo,
      isbn: isbnLimpo,
      autor_id: autorId,
      total_exemplares: totalExemplares,
      disponiveis: totalExemplares
    })
  }
}
