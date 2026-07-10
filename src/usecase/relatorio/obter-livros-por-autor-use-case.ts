import { LivrosPorAutor } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterLivrosPorAutorUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<LivrosPorAutor[]> {
    return this.relatorioRepository.obterLivrosPorAutor()
  }
}
