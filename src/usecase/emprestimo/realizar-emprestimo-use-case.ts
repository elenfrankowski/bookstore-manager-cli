import { Emprestimo } from '../../model/emprestimo'
import { ClienteRepository } from '../../repositories/cliente-repository'
import { EmprestimoRepository } from '../../repositories/emprestimo-repository'
import { LivroRepository } from '../../repositories/livro-repository'

export class RealizarEmprestimoUseCase {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly clienteRepository: ClienteRepository,
    private readonly livroRepository: LivroRepository
  ) {}

  async executar(clienteId: number, livroId: number): Promise<Emprestimo> {
    if (!clienteId || clienteId <= 0) {
      throw new Error('ID do cliente inválido.')
    }
    if (!livroId || livroId <= 0) {
      throw new Error('ID do livro inválido.')
    }

    const cliente = await this.clienteRepository.buscarPorId(clienteId)
    if (!cliente) {
      throw new Error(
        'Não é possível realizar o empréstimo: Cliente não encontrado.'
      )
    }

    const livro = await this.livroRepository.buscarPorId(livroId)
    if (!livro?.id) {
      throw new Error(
        'Não é possível realizar o empréstimo: Livro não encontrado.'
      )
    }

    if (livro.disponiveis <= 0) {
      throw new Error(
        `O livro "${livro.titulo}" não possui exemplares disponíveis para empréstimo no momento.`
      )
    }

    const emprestimoAtivo =
      await this.emprestimoRepository.buscarAtivoPorClienteELivro(
        clienteId,
        livroId
      )
    if (emprestimoAtivo) {
      throw new Error(
        'Este cliente já possui um empréstimo ativo deste mesmo livro.'
      )
    }

    const novoEmprestimo = await this.emprestimoRepository.criar({
      cliente_id: clienteId,
      livro_id: livroId
    })

    await this.livroRepository.atualizar(livro.id, {
      titulo: livro.titulo,
      isbn: livro.isbn,
      autor_id: livro.autor_id,
      total_exemplares: livro.total_exemplares,
      disponiveis: livro.disponiveis - 1
    })

    return novoEmprestimo
  }
}
