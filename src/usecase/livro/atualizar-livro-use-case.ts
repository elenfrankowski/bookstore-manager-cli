import { Livro } from '../../model/livro'
import { AutorRepository } from '../../repositories/autor-repository'
import { LivroRepository } from '../../repositories/livro-repository'

export class AtualizarLivroUseCase {
  constructor(
    private readonly livroRepository: LivroRepository,
    private readonly autorRepository: AutorRepository
  ) {}

  async executar({
    id,
    titulo,
    isbn,
    autorId,
    totalExemplares,
    disponiveis
  }: {
    id: number
    titulo: string
    isbn: string
    autorId: number
    totalExemplares: number
    disponiveis: number
  }): Promise<Livro> {
    const tituloLimpo = titulo.trim()
    const isbnLimpo = isbn.trim()

    if (!tituloLimpo || !isbnLimpo) {
      throw new Error('Título e ISBN são campos obrigatórios.')
    }
    if (totalExemplares < 0 || disponiveis < 0) {
      throw new Error('As quantidades de exemplares não podem ser negativas.')
    }
    if (disponiveis > totalExemplares) {
      throw new Error(
        'A quantidade de livros disponíveis não pode ser maior que o total de exemplares.'
      )
    }

    const livroExiste = await this.livroRepository.buscarPorId(id)
    if (!livroExiste) {
      throw new Error('Livro não encontrado para atualização.')
    }

    const autorExiste = await this.autorRepository.buscarPorId(autorId)
    if (!autorExiste) {
      throw new Error('O autor informado não existe.')
    }

    const isbnDuplicado = await this.livroRepository.buscarPorIsbn(isbnLimpo)
    if (isbnDuplicado && isbnDuplicado.id !== id) {
      throw new Error('Este ISBN já está cadastrado em outro livro.')
    }

    const livroAtualizado = await this.livroRepository.atualizar(id, {
      titulo: tituloLimpo,
      isbn: isbnLimpo,
      autor_id: autorId,
      total_exemplares: totalExemplares,
      disponiveis
    })
    if (!livroAtualizado) {
      throw new Error('Não foi possível atualizar o livro.')
    }

    return livroAtualizado
  }
}
