import { EmprestimoDetalhado } from '../../model/emprestimo'
import { EmprestimoRepository } from '../../repositories/emprestimo-repository'

export class ListarEmprestimosUseCase {
  constructor(private readonly emprestimoRepository: EmprestimoRepository) {}

  async executar(): Promise<EmprestimoDetalhado[]> {
    return this.emprestimoRepository.listarComDetalhes()
  }
}
