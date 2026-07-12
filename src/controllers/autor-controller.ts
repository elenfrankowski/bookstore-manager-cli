import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { AtualizarAutorUseCase } from '../usecase/autor/atualizar-autor-use-case'
import { BuscarAutorUseCase } from '../usecase/autor/buscar-autor-use-case'
import { CriarAutorUseCase } from '../usecase/autor/criar-autor-use-case'
import { ListarAutoresUseCase } from '../usecase/autor/listar-autores-use-case'
import { RemoverAutorUseCase } from '../usecase/autor/remover-autor-use-case'

export class AutorController {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly criarAutorUseCase: CriarAutorUseCase,
    private readonly listarAutoresUseCase: ListarAutoresUseCase,
    private readonly buscarAutorUseCase: BuscarAutorUseCase,
    private readonly atualizarAutorUseCase: AtualizarAutorUseCase,
    private readonly removerAutorUseCase: RemoverAutorUseCase
  ) {}

  async exibirMenu(): Promise<void> {
    let voltar = false
    while (!voltar) {
      console.clear()
      console.log('=== GERENCIAR AUTORES ===')
      console.log('')
      console.log('1. Cadastrar autor')
      console.log('2. Listar autores')
      console.log('3. Buscar autor por ID')
      console.log('4. Atualizar autor')
      console.log('5. Remover autor')
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

  private async exibirListaAutores(): Promise<void> {
    const autores = await this.listarAutoresUseCase.executar()
    console.log('\n--- LISTA DE AUTORES ---')
    if (autores.length === 0) {
      console.log('Nenhum autor cadastrado.')
    } else {
      for (const autor of autores) {
        console.log(`ID: ${String(autor.id)} | Nome: ${autor.nome}`)
      }
    }
    console.log('')
  }

  private async criar(): Promise<void> {
    const nome = await this.leitor.question('Nome do autor: ')
    const autor = await this.criarAutorUseCase.executar(nome)
    console.log(
      `\nAutor "${autor.nome}" cadastrado com sucesso! (ID: ${String(autor.id)})`
    )
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async listar(): Promise<void> {
    await this.exibirListaAutores()
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async buscar(): Promise<void> {
    await this.exibirListaAutores()
    const idTexto = await this.leitor.question('ID do autor a buscar: ')
    const autor = await this.buscarAutorUseCase.executar(Number(idTexto))
    console.log(`\nID: ${String(autor.id)} | Nome: ${autor.nome}`)
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async atualizar(): Promise<void> {
    await this.exibirListaAutores()
    const idTexto = await this.leitor.question('ID do autor a atualizar: ')
    const novoNome = await this.leitor.question('Novo nome: ')
    const autor = await this.atualizarAutorUseCase.executar(
      Number(idTexto),
      novoNome
    )
    console.log(
      `\nAutor atualizado: ID: ${String(autor.id)} | Nome: ${autor.nome}`
    )
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async remover(): Promise<void> {
    await this.exibirListaAutores()
    const idTexto = await this.leitor.question('ID do autor a remover: ')
    await this.removerAutorUseCase.executar(Number(idTexto))
    console.log('\nAutor removido com sucesso!')
    await this.leitor.question('Pressione ENTER para continuar...')
  }
}
