import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { ListarClientesUseCase } from '../usecase/cliente/listar-clientes-use-case'
import { RealizarEmprestimoUseCase } from '../usecase/emprestimo/realizar-emprestimo-use-case'
import { RegistrarDevolucaoUseCase } from '../usecase/emprestimo/registrar-devolucao-use-case'
import { ListarLivrosUseCase } from '../usecase/livro/listar-livros-use-case'

export class EmprestimoController {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly realizarEmprestimoUseCase: RealizarEmprestimoUseCase,
    private readonly registrarDevolucaoUseCase: RegistrarDevolucaoUseCase,
    private readonly listarClientesUseCase: ListarClientesUseCase,
    private readonly listarLivrosUseCase: ListarLivrosUseCase
  ) {}

  async exibirMenu(): Promise<void> {
    let voltar = false
    while (!voltar) {
      console.clear()
      console.log('=== EMPRÉSTIMOS ===')
      console.log('')
      console.log('1. Registrar novo empréstimo')
      console.log('2. Registrar devolução')
      console.log('0. Voltar ao menu principal')
      console.log('')

      const opcao = await this.leitor.question('Escolha uma opção: ')

      try {
        switch (opcao) {
          case '1':
            await this.criar()
            break
          case '2':
            await this.devolver()
            break
          case '0':
            voltar = true
            break
          default:
            console.log('\nOpção inválida.')
            await this.leitor.question('\nPressione ENTER para continuar...')
        }
      } catch (error) {
        const mensagem =
          error instanceof Error ? error.message : 'Erro desconhecido.'
        console.log(`\nErro: ${mensagem}`)
        await this.leitor.question('\nPressione ENTER para continuar...')
      }
    }
  }

  private async exibirClientesDisponiveis(): Promise<void> {
    const clientes = await this.listarClientesUseCase.executar()
    console.log('\n--- CLIENTES CADASTRADOS ---')
    if (clientes.length === 0) {
      console.log('Nenhum cliente cadastrado no sistema.')
    } else {
      for (const cliente of clientes) {
        console.log(
          `ID: ${String(cliente.id)} | ${cliente.nome} ${cliente.sobrenome} | E-mail: ${cliente.email}`
        )
      }
    }
    console.log('')
  }

  private async exibirLivrosDisponiveis(): Promise<void> {
    const livros = await this.listarLivrosUseCase.executar()
    console.log('\n--- LIVROS EM ESTOQUE ---')
    if (livros.length === 0) {
      console.log('Nenhum livro cadastrado no sistema.')
    } else {
      for (const livro of livros) {
        console.log(
          `ID: ${String(livro.id)} | Título: ${livro.titulo} | Disponíveis: ${String(livro.disponiveis)}/${String(livro.total_exemplares)}`
        )
      }
    }
    console.log('')
  }

  private async criar(): Promise<void> {
    await this.exibirClientesDisponiveis()
    const clienteIdInput = await this.leitor.question(
      'ID do Cliente que vai pegar o livro: '
    )

    await this.exibirLivrosDisponiveis()
    const livroIdInput = await this.leitor.question(
      'ID do Livro a ser emprestado: '
    )

    if (!clienteIdInput.trim() || !livroIdInput.trim()) {
      throw new Error(
        'ID do Cliente e ID do Livro são obrigatórios para realizar um empréstimo.'
      )
    }

    const emprestimo = await this.realizarEmprestimoUseCase.executar(
      Number(clienteIdInput),
      Number(livroIdInput)
    )

    console.log('\n====================================')
    console.log('   EMPRÉSTIMO REALIZADO COM SUCESSO!')
    console.log('====================================')
    console.log(`ID do Empréstimo: ${String(emprestimo.id)}`)
    console.log(`Status: ${emprestimo.status}`)
    console.log('====================================')

    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async devolver(): Promise<void> {
    await this.exibirClientesDisponiveis()
    const clienteIdInput = await this.leitor.question(
      'ID do Cliente que está devolvendo: '
    )

    await this.exibirLivrosDisponiveis()
    const livroIdInput = await this.leitor.question(
      'ID do Livro a ser devolvido: '
    )

    if (!clienteIdInput.trim() || !livroIdInput.trim()) {
      throw new Error(
        'ID do Cliente e ID do Livro são obrigatórios para registrar a devolução.'
      )
    }

    const emprestimo = await this.registrarDevolucaoUseCase.executar(
      Number(clienteIdInput),
      Number(livroIdInput)
    )

    console.log('\n====================================')
    console.log('   DEVOLUÇÃO REGISTRADA COM SUCESSO!')
    console.log('====================================')
    console.log(`ID do Empréstimo: ${String(emprestimo.id)}`)
    console.log(`Status: ${emprestimo.status}`)
    console.log('====================================')

    await this.leitor.question('\nPressione ENTER para continuar...')
  }
}
