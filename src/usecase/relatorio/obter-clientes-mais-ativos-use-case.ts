import { ClienteMaisAtivo } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterClientesMaisAtivosUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<ClienteMaisAtivo[]> {
    return this.relatorioRepository.obterClientesMaisAtivos()
  }
}
