import { Pool } from 'pg'

import { Emprestimo, EmprestimoDetalhado } from '../model/emprestimo'

export class EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async criarComBaixaEstoque(
    clienteId: number,
    livroId: number
  ): Promise<Emprestimo> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const resultLivro = await client.query(
        'UPDATE livro SET disponiveis = disponiveis - 1 WHERE id = $1 AND disponiveis > 0',
        [livroId]
      )
      if (resultLivro.rowCount === 0) {
        throw new Error('Livro sem exemplares disponíveis para empréstimo.')
      }

      const {
        rows: [row]
      } = await client.query<Emprestimo>(
        'INSERT INTO emprestimo (cliente_id, livro_id) VALUES ($1, $2) RETURNING id, cliente_id, livro_id, data_emprestimo, data_devolucao, status',
        [clienteId, livroId]
      )

      await client.query('COMMIT')
      return row
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async registrarDevolucaoComReposicaoEstoque(
    id: number,
    livroId: number,
    dataDevolucao: Date
  ): Promise<Emprestimo> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const { rows } = await client.query<Emprestimo>(
        "UPDATE emprestimo SET data_devolucao = $1, status = 'DEVOLVIDO' WHERE id = $2 AND status = 'ATIVO' RETURNING id, cliente_id, livro_id, data_emprestimo, data_devolucao, status",
        [dataDevolucao, id]
      )
      if (rows.length === 0) {
        throw new Error('Empréstimo não encontrado ou já devolvido.')
      }

      await client.query(
        'UPDATE livro SET disponiveis = disponiveis + 1 WHERE id = $1 AND disponiveis < total_exemplares',
        [livroId]
      )

      await client.query('COMMIT')
      return rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async buscarAtivoPorClienteELivro(
    clienteId: number,
    livroId: number
  ): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query<Emprestimo>(
      'SELECT id, cliente_id, livro_id, data_emprestimo, data_devolucao, status FROM emprestimo WHERE cliente_id = $1 AND livro_id = $2 AND status = $3',
      [clienteId, livroId, 'ATIVO']
    )

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  async listarTodos(): Promise<Emprestimo[]> {
    const { rows } = await this.pool.query<Emprestimo>(
      'SELECT id, cliente_id, livro_id, data_emprestimo, data_devolucao, status FROM emprestimo ORDER BY data_emprestimo DESC'
    )
    return rows
  }

  async listarComDetalhes(): Promise<EmprestimoDetalhado[]> {
    const { rows } = await this.pool.query<EmprestimoDetalhado>(
      `SELECT
        e.id,
        l.titulo AS livro_titulo,
        c.nome AS cliente_nome,
        e.data_emprestimo,
        e.data_devolucao,
        e.status
      FROM emprestimo e
      INNER JOIN livro l ON l.id = e.livro_id
      INNER JOIN cliente c ON c.id = e.cliente_id
      ORDER BY e.data_emprestimo DESC`
    )
    return rows
  }
}
