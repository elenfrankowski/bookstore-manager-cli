import { LeitorTerminal } from '../@common/utils/leitor-terminal'
import { ListarAutoresUseCase } from '../usecase/autor/listar-autores-use-case'
import { AtualizarLivroUseCase } from '../usecase/livro/atualizar-livro-use-case'
import { BuscarLivroUseCase } from '../usecase/livro/buscar-livro-use-case'
import { CriarLivroUseCase } from '../usecase/livro/criar-livro-use-case'
import { ListarLivrosUseCase } from '../usecase/livro/listar-livros-use-case'
import { RemoverLivroUseCase } from '../usecase/livro/remover-livro-use-case'

export class LivroController {
  constructor(
    private readonly leitor: LeitorTerminal,
    private readonly criarLivroUseCase: CriarLivroUseCase,
    private readonly listarLivrosUseCase: ListarLivrosUseCase,
    private readonly buscarLivroUseCase: BuscarLivroUseCase,
    private readonly atualizarLivroUseCase: AtualizarLivroUseCase,
    private readonly removerLivroUseCase: RemoverLivroUseCase,
    private readonly listarAutoresUseCase: ListarAutoresUseCase
  ) {}

  async exibirMenu(): Promise<void> {
    let voltar = false
    while (!voltar) {
      console.clear()
      console.log('=== GERENCIAR LIVROS ===')
      console.log('')
      console.log('1. Cadastrar livro')
      console.log('2. Listar livros')
      console.log('3. Buscar livro por ID')
      console.log('4. Atualizar livro')
      console.log('5. Remover livro')
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

  private async exibirListaLivros(): Promise<void> {
    const livros = await this.listarLivrosUseCase.executar()
    console.log('\n--- LISTA DE LIVROS ---')
    if (livros.length === 0) {
      console.log('Nenhum livro cadastrado.')
    } else {
      for (const livro of livros) {
        console.log(
          `ID: ${String(livro.id)} | Título: ${livro.titulo} | ISBN: ${livro.isbn} | Estoque: ${String(livro.disponiveis)}/${String(livro.total_exemplares)}`
        )
      }
    }
    console.log('')
  }

  private async exibirAutoresDisponiveis(): Promise<void> {
    const autores = await this.listarAutoresUseCase.executar()
    console.log('\n--- AUTORES DISPONÍVEIS ---')
    for (const autor of autores) {
      console.log(`ID: ${String(autor.id)} | Nome: ${autor.nome}`)
    }
    console.log('')
  }

  private async criar(): Promise<void> {
    const titulo = await this.leitor.question('Título do livro: ')
    const isbn = await this.leitor.question('ISBN: ')
    const totalExemplares = await this.leitor.question('Total de exemplares: ')

    await this.exibirAutoresDisponiveis()
    const autorId = await this.leitor.question('ID do Autor do livro: ')

    const livro = await this.criarLivroUseCase.executar(
      titulo,
      isbn,
      Number(autorId),
      Number(totalExemplares)
    )

    console.log(
      `\nLivro "${livro.titulo}" cadastrado com sucesso! (ID: ${String(livro.id)})`
    )
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async listar(): Promise<void> {
    await this.exibirListaLivros()
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async buscar(): Promise<void> {
    await this.exibirListaLivros()
    const idTexto = await this.leitor.question('ID do livro a buscar: ')
    const livro = await this.buscarLivroUseCase.executar(Number(idTexto))

    console.log(
      `\nID: ${String(livro.id)}\nTítulo: ${livro.titulo}\nISBN: ${livro.isbn}\nTotal: ${String(livro.total_exemplares)} | Disponíveis: ${String(livro.disponiveis)}`
    )
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async atualizar(): Promise<void> {
    await this.exibirListaLivros()
    const idTexto = await this.leitor.question('ID do livro a atualizar: ')
    const livroAtual = await this.buscarLivroUseCase.executar(Number(idTexto))

    console.log('\n--- DADOS ATUAIS ---')
    console.log(`Título: ${livroAtual.titulo}`)
    console.log(`ISBN: ${livroAtual.isbn}`)
    console.log(`Autor ID: ${String(livroAtual.autor_id)}`)
    console.log(`Total de exemplares: ${String(livroAtual.total_exemplares)}`)
    console.log(`Disponíveis: ${String(livroAtual.disponiveis)}`)
    console.log(
      '\n(Pressione ENTER sem digitar nada para manter o valor atual)\n'
    )

    const tituloInput = await this.leitor.question(
      `Novo Título [${livroAtual.titulo}]: `
    )
    const isbnInput = await this.leitor.question(
      `Novo ISBN [${livroAtual.isbn}]: `
    )

    await this.exibirAutoresDisponiveis()
    const autorIdInput = await this.leitor.question(
      `Novo ID do Autor [${String(livroAtual.autor_id)}]: `
    )

    const totalInput = await this.leitor.question(
      `Novo Total de exemplares [${String(livroAtual.total_exemplares)}]: `
    )
    const disponiveisInput = await this.leitor.question(
      `Nova quantidade disponível [${String(livroAtual.disponiveis)}]: `
    )

    await this.atualizarLivroUseCase.executar({
      id: Number(idTexto),
      titulo: tituloInput.trim() === '' ? livroAtual.titulo : tituloInput,
      isbn: isbnInput.trim() === '' ? livroAtual.isbn : isbnInput,
      autorId:
        autorIdInput.trim() === '' ? livroAtual.autor_id : Number(autorIdInput),
      totalExemplares:
        totalInput.trim() === ''
          ? livroAtual.total_exemplares
          : Number(totalInput),
      disponiveis:
        disponiveisInput.trim() === ''
          ? livroAtual.disponiveis
          : Number(disponiveisInput)
    })

    console.log('\nLivro atualizado com sucesso!')
    await this.leitor.question('Pressione ENTER para continuar...')
  }

  private async remover(): Promise<void> {
    await this.exibirListaLivros()
    const idTexto = await this.leitor.question('ID do livro a remover: ')
    await this.removerLivroUseCase.executar(Number(idTexto))
    console.log('\nLivro removido com sucesso!')
    await this.leitor.question('Pressione ENTER para continuar...')
  }
}
