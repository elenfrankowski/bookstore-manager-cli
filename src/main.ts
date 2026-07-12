import { initDatabase, pool } from './@common/database/database'
import { LeitorTerminal } from './@common/utils/leitor-terminal'
import { AutorController } from './controllers/autor-controller'
import { AutorRepository } from './repositories/autor-repository'
import { AtualizarAutorUseCase } from './usecase/autor/atualizar-autor-use-case'
import { BuscarAutorUseCase } from './usecase/autor/buscar-autor-use-case'
import { CriarAutorUseCase } from './usecase/autor/criar-autor-use-case'
import { ListarAutoresUseCase } from './usecase/autor/listar-autores-use-case'
import { RemoverAutorUseCase } from './usecase/autor/remover-autor-use-case'
import { MainView } from './view/main.view'

async function iniciar() {
  try {
    await initDatabase()

    const leitor = new LeitorTerminal()

    const autorRepository = new AutorRepository(pool)
    const criarAutorUseCase = new CriarAutorUseCase(autorRepository)
    const listarAutoresUseCase = new ListarAutoresUseCase(autorRepository)
    const buscarAutorUseCase = new BuscarAutorUseCase(autorRepository)
    const atualizarAutorUseCase = new AtualizarAutorUseCase(autorRepository)
    const removerAutorUseCase = new RemoverAutorUseCase(autorRepository)

    const autorController = new AutorController(
      leitor,
      criarAutorUseCase,
      listarAutoresUseCase,
      buscarAutorUseCase,
      atualizarAutorUseCase,
      removerAutorUseCase
    )

    const mainView = new MainView(leitor, autorController)
    await mainView.exibirMenuPrincipal()
  } catch (error) {
    console.error('Erro crítico na aplicação: ', error)
  } finally {
    await pool.end()
  }
}

void iniciar()
