import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { AutorController } from '../controllers/autor-controller'
import { ClienteController } from '../controllers/cliente-controller'
import { EmprestimoController } from '../controllers/emprestimo-controller'
import { LivroController } from '../controllers/livro-controller'
import { RelatorioController } from '../controllers/relatorio-controller'

export class MainView {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly autorController: AutorController,
    private readonly clienteController: ClienteController,
    private readonly livroController: LivroController,
    private readonly emprestimoController: EmprestimoController,
    private readonly relatorioController: RelatorioController
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
      console.log('4. Gerenciar Empréstimos')
      console.log('5. Relatórios Avançados')
      console.log('0. Sair do Sistema')
      console.log('====================================')
      console.log('')

      const opcao = await this.leitor.question('Escolha uma opção: ')

      switch (opcao) {
        case '1':
          await this.autorController.exibirMenu()
          break
        case '2':
          await this.clienteController.exibirMenu()
          break
        case '3':
          await this.livroController.exibirMenu()
          break
        case '4':
          await this.emprestimoController.exibirMenu()
          break
        case '5':
          await this.relatorioController.exibirMenu()
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
}
