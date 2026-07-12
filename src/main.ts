import { initDatabase, pool } from './@common/database/database'
import { LeitorTerminal } from './@common/utils/leitor-terminal'
import { AutorController } from './controllers/autor-controller'
import { ClienteController } from './controllers/cliente-controller'
import { AutorRepository } from './repositories/autor-repository'
import { ClienteRepository } from './repositories/cliente-repository'
import { AtualizarAutorUseCase } from './usecase/autor/atualizar-autor-use-case'
import { BuscarAutorUseCase } from './usecase/autor/buscar-autor-use-case'
import { CriarAutorUseCase } from './usecase/autor/criar-autor-use-case'
import { ListarAutoresUseCase } from './usecase/autor/listar-autores-use-case'
import { RemoverAutorUseCase } from './usecase/autor/remover-autor-use-case'
import { AtualizarClienteUseCase } from './usecase/cliente/atualizar-cliente-use-case'
import { BuscarClienteUseCase } from './usecase/cliente/buscar-cliente-use-case'
import { CriarClienteUseCase } from './usecase/cliente/criar-cliente-use-case'
import { ListarClientesUseCase } from './usecase/cliente/listar-clientes-use-case'
import { RemoverClienteUseCase } from './usecase/cliente/remover-cliente-use-case'
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

    const clienteRepository = new ClienteRepository(pool)
    const criarClienteUseCase = new CriarClienteUseCase(clienteRepository)
    const listarClientesUseCase = new ListarClientesUseCase(clienteRepository)
    const buscarClienteUseCase = new BuscarClienteUseCase(clienteRepository)
    const atualizarClienteUseCase = new AtualizarClienteUseCase(
      clienteRepository
    )
    const removerClienteUseCase = new RemoverClienteUseCase(clienteRepository)

    const clienteController = new ClienteController(
      leitor,
      criarClienteUseCase,
      listarClientesUseCase,
      buscarClienteUseCase,
      atualizarClienteUseCase,
      removerClienteUseCase
    )

    const mainView = new MainView(leitor, autorController, clienteController)
    await mainView.exibirMenuPrincipal()
  } catch (error) {
    console.error('Erro crítico na aplicação: ', error)
  } finally {
    await pool.end()
  }
}

void iniciar()
