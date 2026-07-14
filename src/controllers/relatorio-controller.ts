import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { ObterClientesComEmprestimosAtivosUseCase } from '../usecase/relatorio/obter-clientes-com-emprestimos-ativos-use-case'
import { ObterClientesMaisAtivosUseCase } from '../usecase/relatorio/obter-clientes-mais-ativos-use-case'
import { ObterEmprestimosPorLivroUseCase } from '../usecase/relatorio/obter-emprestimos-por-livro-use-case'
import { ObterLivrosDisponiveisUseCase } from '../usecase/relatorio/obter-livros-disponiveis-use-case'
import { ObterLivrosEmprestadosUseCase } from '../usecase/relatorio/obter-livros-emprestados-use-case'
import { ObterLivrosMaisEmprestadosUseCase } from '../usecase/relatorio/obter-livros-mais-emprestados-use-case'
import { ObterLivrosPorAutorUseCase } from '../usecase/relatorio/obter-livros-por-autor-use-case'

export class RelatorioController {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly obterLivrosDisponiveisUseCase: ObterLivrosDisponiveisUseCase,
    private readonly obterLivrosEmprestadosUseCase: ObterLivrosEmprestadosUseCase,
    private readonly obterLivrosPorAutorUseCase: ObterLivrosPorAutorUseCase,
    private readonly obterEmprestimosPorLivroUseCase: ObterEmprestimosPorLivroUseCase,
    private readonly obterClientesComEmprestimosAtivosUseCase: ObterClientesComEmprestimosAtivosUseCase,
    private readonly obterLivrosMaisEmprestadosUseCase: ObterLivrosMaisEmprestadosUseCase,
    private readonly obterClientesMaisAtivosUseCase: ObterClientesMaisAtivosUseCase
  ) {}

  async exibirMenu(): Promise<void> {
    let voltar = false
    while (!voltar) {
      console.clear()
      console.log('=== RELATÓRIOS ===')
      console.log('')
      console.log('1. Livros disponíveis')
      console.log('2. Livros emprestados')
      console.log('3. Livros cadastrados por autor')
      console.log('4. Quantidade de empréstimos por livro')
      console.log('5. Clientes com empréstimos ativos')
      console.log('6. Top 5 livros mais emprestados')
      console.log('7. Top 5 clientes mais ativos')
      console.log('0. Voltar ao menu principal')
      console.log('')

      const opcao = await this.leitor.question('Escolha uma opção: ')

      try {
        switch (opcao) {
          case '1':
            await this.livrosDisponiveis()
            break
          case '2':
            await this.livrosEmprestados()
            break
          case '3':
            await this.livrosPorAutor()
            break
          case '4':
            await this.emprestimosPorLivro()
            break
          case '5':
            await this.clientesComEmprestimosAtivos()
            break
          case '6':
            await this.livrosMaisEmprestados()
            break
          case '7':
            await this.clientesMaisAtivos()
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

  private async livrosDisponiveis(): Promise<void> {
    const livros = await this.obterLivrosDisponiveisUseCase.executar()
    console.log('\n--- LIVROS DISPONÍVEIS ---')
    if (livros.length === 0) {
      console.log('Nenhum livro disponível no momento.')
    } else {
      for (const livro of livros) {
        console.log(
          `ID: ${String(livro.id)} | ${livro.titulo} | ISBN: ${livro.isbn} | Disponíveis: ${String(livro.disponiveis)}`
        )
      }
    }
    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async livrosEmprestados(): Promise<void> {
    const livros = await this.obterLivrosEmprestadosUseCase.executar()
    console.log('\n--- LIVROS EMPRESTADOS (ATIVOS) ---')
    if (livros.length === 0) {
      console.log('Nenhum livro emprestado no momento.')
    } else {
      for (const livro of livros) {
        console.log(
          `${livro.titulo} | Cliente: ${livro.cliente_nome} | Data: ${livro.data_emprestimo.toLocaleDateString('pt-BR')}`
        )
      }
    }
    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async livrosPorAutor(): Promise<void> {
    const dados = await this.obterLivrosPorAutorUseCase.executar()
    console.log('\n--- LIVROS CADASTRADOS POR AUTOR ---')
    for (const item of dados) {
      console.log(`${item.autor_nome}: ${String(item.total_livros)} livro(s)`)
    }
    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async emprestimosPorLivro(): Promise<void> {
    const dados = await this.obterEmprestimosPorLivroUseCase.executar()
    console.log('\n--- EMPRÉSTIMOS POR LIVRO ---')
    for (const item of dados) {
      console.log(
        `${item.titulo}: ${String(item.total_emprestimos)} empréstimo(s)`
      )
    }
    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async clientesComEmprestimosAtivos(): Promise<void> {
    const dados = await this.obterClientesComEmprestimosAtivosUseCase.executar()
    console.log('\n--- CLIENTES COM EMPRÉSTIMOS ATIVOS ---')
    if (dados.length === 0) {
      console.log('Nenhum cliente com empréstimo ativo no momento.')
    } else {
      for (const item of dados) {
        console.log(
          `${item.nome_completo}: ${String(item.total_emprestimos_ativos)} empréstimo(s) ativo(s)`
        )
      }
    }
    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async livrosMaisEmprestados(): Promise<void> {
    const dados = await this.obterLivrosMaisEmprestadosUseCase.executar()
    console.log('\n--- TOP 5 LIVROS MAIS EMPRESTADOS ---')
    dados.forEach((item, index) => {
      console.log(
        `${String(index + 1)}. ${item.titulo} — ${String(item.total_emprestimos)} empréstimo(s)`
      )
    })
    await this.leitor.question('\nPressione ENTER para continuar...')
  }

  private async clientesMaisAtivos(): Promise<void> {
    const dados = await this.obterClientesMaisAtivosUseCase.executar()
    console.log('\n--- TOP 5 CLIENTES MAIS ATIVOS ---')
    dados.forEach((item, index) => {
      console.log(
        `${String(index + 1)}. ${item.nome_completo} — ${String(item.total_emprestimos)} empréstimo(s)`
      )
    })
    await this.leitor.question('\nPressione ENTER para continuar...')
  }
}
