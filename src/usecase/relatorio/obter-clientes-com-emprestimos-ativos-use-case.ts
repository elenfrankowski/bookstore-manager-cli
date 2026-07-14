import { ClienteComEmprestimoAtivo } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterClientesComEmprestimosAtivosUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<ClienteComEmprestimoAtivo[]> {
    return this.relatorioRepository.obterClientesComEmprestimosAtivos()
  }
}
