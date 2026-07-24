import { Emprestimo } from '../../model/emprestimo'
import { EmprestimoRepository } from '../../repositories/emprestimo-repository'

export class RegistrarDevolucaoUseCase {
  constructor(private readonly emprestimoRepository: EmprestimoRepository) {}

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
    return this.emprestimoRepository.registrarDevolucaoComReposicaoEstoque(
      emprestimoAtivo.id,
      livroId,
      dataHoje
    )
  }
}
