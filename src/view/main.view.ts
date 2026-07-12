import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { AutorController } from '../controllers/autor-controller'

export class MainView {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly autorController: AutorController
  ) {}

  async exibirMenuPrincipal(): Promise<void> {
    let rodando = true
    while (rodando) {
      console.clear()
      console.log('====================================')
      console.log('       GERENCIADOR DA LIVRARIA      ')
      console.log('====================================')
      console.log('')
      console.log('1. Gerenciar Autores')
      console.log('2. Gerenciar Clientes')
      console.log('3. Gerenciar Livros')
      console.log('4. Realizar Empréstimo')
      console.log('5. Registrar Devolução')
      console.log('6. Relatórios Avançados')
      console.log('0. Sair do Sistema')
      console.log('====================================')
      console.log('')

      const opcao = await this.leitor.question('Escolha uma opção: ')

      switch (opcao) {
        case '1':
          await this.autorController.exibirMenu()
          break
        case '2':
          await this.menuClientes()
          break
        case '3':
          await this.menuLivros()
          break
        case '4':
          await this.menuEmprestimos()
          break
        case '5':
          await this.menuDevolucoes()
          break
        case '6':
          await this.menuRelatorios()
          break
        case '0':
          console.log('\nEncerrando o sistema... Até logo!')
          this.leitor.fechar()
          rodando = false
          break
        default:
          await this.leitor.question(
            '\nOpção Inválida! Pressione ENTER para tentar novamente...'
          )
          break
      }
    }
  }

  private async menuClientes() {
    console.clear()
    console.log('--- GERENCIAR CLIENTES ---')
    await this.leitor.question(
      '\nMenu em desenvolvimento... Pressione ENTER para voltar.'
    )
  }

  private async menuLivros() {
    console.clear()
    console.log('--- GERENCIAR LIVROS ---')
    await this.leitor.question(
      '\nMenu em desenvolvimento... Pressione ENTER para voltar.'
    )
  }

  private async menuEmprestimos() {
    console.clear()
    console.log('--- REALIZAR EMPRÉSTIMO ---')
    await this.leitor.question(
      '\nMenu em desenvolvimento... Pressione ENTER para voltar.'
    )
  }

  private async menuDevolucoes() {
    console.clear()
    console.log('--- REGISTRAR DEVOLUÇÃO ---')
    await this.leitor.question(
      '\nMenu em desenvolvimento... Pressione ENTER para voltar.'
    )
  }

  private async menuRelatorios() {
    console.clear()
    console.log('--- RELATÓRIOS AVANÇADOS ---')
    await this.leitor.question(
      '\nMenu em desenvolvimento... Pressione ENTER para voltar.'
    )
  }
}
