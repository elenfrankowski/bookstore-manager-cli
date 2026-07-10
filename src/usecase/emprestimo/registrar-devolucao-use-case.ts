import { Emprestimo } from '../../model/emprestimo'
import { EmprestimoRepository } from '../../repositories/emprestimo-repository'
import { LivroRepository } from '../../repositories/livro-repository'

export class RegistrarDevolucaoUseCase {
  constructor(
    private readonly emprestimoRepository: EmprestimoRepository,
    private readonly livroRepository: LivroRepository
  ) {}

  async executar(clienteId: number, livroId: number): Promise<Emprestimo> {
    if (!clienteId || clienteId <= 0) {
      throw new Error('ID do cliente inválido.')
    }
    if (!livroId || livroId <= 0) {
      throw new Error('ID do livro inválido.')
    }

    const emprestimoAtivo =
      await this.emprestimoRepository.buscarAtivoPorClienteELivro(
        clienteId,
        livroId
      )
    if (!emprestimoAtivo?.id) {
      throw new Error(
        'Não foi encontrado nenhum empréstimo ativo para este cliente e livro.'
      )
    }

    const dataHoje = new Date()
    const emprestimoDevolvido =
      await this.emprestimoRepository.registrarDevolucao(
        emprestimoAtivo.id,
        dataHoje
      )
    if (!emprestimoDevolvido) {
      throw new Error('Não foi possível registrar a devolução do empréstimo.')
    }

    const livro = await this.livroRepository.buscarPorId(livroId)
    if (!livro?.id) {
      throw new Error(
        'Livro associado ao empréstimo não foi encontrado para atualização do estoque.'
      )
    }

    await this.livroRepository.atualizar(livro.id, {
      titulo: livro.titulo,
      isbn: livro.isbn,
      autor_id: livro.autor_id,
      total_exemplares: livro.total_exemplares,
      disponiveis: livro.disponiveis + 1
    })

    return emprestimoDevolvido
  }
}
