import { LivroEmprestado } from '../../model/relatorio'
import { RelatorioRepository } from '../../repositories/relatorio-repository'

export class ObterLivrosEmprestadosUseCase {
  constructor(private readonly relatorioRepository: RelatorioRepository) {}

  async executar(): Promise<LivroEmprestado[]> {
    return this.relatorioRepository.obterLivrosEmprestados()
  }
}
