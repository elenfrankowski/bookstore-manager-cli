import { Pool } from 'pg'

import { Emprestimo, EmprestimoDetalhado } from '../model/emprestimo'

export class EmprestimoRepository {
  constructor(private readonly pool: Pool) {}

  async criar(
    emprestimo: Pick<Emprestimo, 'cliente_id' | 'livro_id'>
  ): Promise<Emprestimo> {
    const {
      rows: [row]
    } = await this.pool.query<Emprestimo>(
      'INSERT INTO emprestimo (cliente_id, livro_id) VALUES ($1, $2) RETURNING id, cliente_id, livro_id, data_emprestimo, data_devolucao, status',
      [emprestimo.cliente_id, emprestimo.livro_id]
    )
    return row
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

  async registrarDevolucao(
    id: number,
    dataDevolucao: Date
  ): Promise<Emprestimo | null> {
    const { rows } = await this.pool.query<Emprestimo>(
      "UPDATE emprestimo SET data_devolucao = $1, status = 'DEVOLVIDO' WHERE id = $2 RETURNING id, cliente_id, livro_id, data_emprestimo, data_devolucao, status",
      [dataDevolucao, id]
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
