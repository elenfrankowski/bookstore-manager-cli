import { LivroDisponivel } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterLivrosDisponiveisUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<LivroDisponivel[]> {
    return this.relatorioRepository.obterLivrosDisponiveis()
  }
}
