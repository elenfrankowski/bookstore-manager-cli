import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { AtualizarClienteUseCase } from '../usecase/cliente/atualizar-cliente-use-case'
import { BuscarClienteUseCase } from '../usecase/cliente/buscar-cliente-use-case'
import { CriarClienteUseCase } from '../usecase/cliente/criar-cliente-use-case'
import { ListarClientesUseCase } from '../usecase/cliente/listar-clientes-use-case'
import { RemoverClienteUseCase } from '../usecase/cliente/remover-cliente-use-case'

export class ClienteController {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly criarClienteUseCase: CriarClienteUseCase,
    private readonly listarClientesUseCase: ListarClientesUseCase,
    private readonly buscarClienteUseCase: BuscarClienteUseCase,
    private readonly atualizarClienteUseCase: AtualizarClienteUseCase,
    private readonly removerClienteUseCase: RemoverClienteUseCase
  ) {}

  async exibirMenu(): Promise<void> {
    let voltar = false
    while (!voltar) {
      console.clear()
      console.log('=== GERENCIAR CLIENTES ===')
      console.log('')
      console.log('1. Cadastrar cliente')
      console.log('2. Listar clientes')
      console.log('3. Buscar cliente por ID')
      console.log('4. Atualizar cliente')
      console.log('5. Remover cliente')
      console.log('0. Voltar ao menu principal')
      console.log('')

      const opcao = await this.leitor.question('Escolha uma opção: ')

      try {
        switch (opcao) {
          case '1':
            await this.criar()
            break
          case '2':
            await this.listar()
            break
          case '3':
            await this.buscar()
            break
          case '4':
            await this.atualizar()
            break
          case '5':
            await this.remover()
            break
          case '0':
            voltar = true
            break
          default:
            console.log('\nOpção inválida.')
            await this.leitor.question('Pressione ENTER para continuar...')
        }
      } catch (error) {
        const mensagem =
          error instanceof Error ? error.message : 'Erro desconhecido.'
        console.log(`\nErro: ${mensagem}`)
        await this.leitor.question('Pressione ENTER para continuar...')
      }
    }
  }

  private async exibirListaClientes(): Promise<void> {
    const clientes = await this.listarClientesUseCase.executar()
    console.log('\n--- LISTA DE CLIENTES ---')
    if (clientes.length === 0) {
      console.log('Nenhum cliente cadastrado.')
    } else {
      for (const cliente of clientes) {
        console.log(
          `ID: ${String(cliente.id)} | ${cliente.nome} ${cliente.sobrenome} | E-mail: ${cliente.email}`
        )
      }
    }
    console.log('')
  }

  private async criar(): Promise<void> {
    const nome = await this.leitor.question('Nome: ')
    const sobrenome = await this.leitor.question('Sobrenome: ')
    const email = await this.leitor.question('Email: ')

    const cliente = await this.criarClienteUseCase.executar(
      nome,
      sobrenome,
      email
    )
    console.log(
      `\nCliente "${cliente.nome} ${cliente.sobrenome}" cadastrado com sucesso! (ID: ${String(cliente.id)})`
    )
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async listar(): Promise<void> {
    await this.exibirListaClientes()
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async buscar(): Promise<void> {
    await this.exibirListaClientes()
    const idTexto = await this.leitor.question('ID do cliente a buscar: ')
    const cliente = await this.buscarClienteUseCase.executar(Number(idTexto))
    console.log(
      `\nID: ${String(cliente.id)}\nNome: ${cliente.nome} ${cliente.sobrenome}\nE-mail: ${cliente.email}`
    )
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async atualizar(): Promise<void> {
    await this.exibirListaClientes()
    const idTexto = await this.leitor.question('ID do cliente a atualizar: ')
    const clienteAtual = await this.buscarClienteUseCase.executar(
      Number(idTexto)
    )

    console.log('\n--- DADOS ATUAIS ---')
    console.log(`Nome: ${clienteAtual.nome}`)
    console.log(`Sobrenome: ${clienteAtual.sobrenome}`)
    console.log(`E-mail: ${clienteAtual.email}`)
    console.log(
      '\n(Pressione ENTER sem digitar nada para manter o valor atual)\n'
    )

    const nomeInput = await this.leitor.question(
      `Novo Nome [${clienteAtual.nome}]: `
    )
    const sobrenomeInput = await this.leitor.question(
      `Novo Sobrenome [${clienteAtual.sobrenome}]: `
    )
    const emailInput = await this.leitor.question(
      `Novo E-mail [${clienteAtual.email}]: `
    )

    const nome = nomeInput.trim() === '' ? clienteAtual.nome : nomeInput
    const sobrenome =
      sobrenomeInput.trim() === '' ? clienteAtual.sobrenome : sobrenomeInput
    const email = emailInput.trim() === '' ? clienteAtual.email : emailInput

    const cliente = await this.atualizarClienteUseCase.executar(
      Number(idTexto),
      nome,
      sobrenome,
      email
    )
    console.log(`\nCliente atualizado com sucesso! ID: ${String(cliente.id)}`)
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async remover(): Promise<void> {
    await this.exibirListaClientes()
    const idTexto = await this.leitor.question('ID do cliente a remover: ')
    await this.removerClienteUseCase.executar(Number(idTexto))
    console.log('\nCliente removido com sucesso!')
    await this.leitor.question('Pressione ENTER para continuar...')
  }
}
