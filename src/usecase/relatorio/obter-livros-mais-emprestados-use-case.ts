import { LivroMaisEmprestado } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterLivrosMaisEmprestadosUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<LivroMaisEmprestado[]> {
    return this.relatorioRepository.obterLivrosMaisEmprestados()
  }
}
