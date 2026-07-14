import { EmprestimosPorLivro } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterEmprestimosPorLivroUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<EmprestimosPorLivro[]> {
    return this.relatorioRepository.obterEmprestimosPorLivro()
  }
}
