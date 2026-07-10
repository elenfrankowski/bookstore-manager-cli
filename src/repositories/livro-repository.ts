import { Pool } from 'pg'

import { Livro } from '../model/livro'

export class LivroRepository {
  constructor(private readonly pool: Pool) {}

  async criar(livro: Omit<Livro, 'id'>): Promise<Livro> {
    const {
      rows: [row]
    } = await this.pool.query<Livro>(
      'INSERT INTO livro (titulo, isbn, autor_id, total_exemplares, disponiveis) VALUES ($1, $2, $3, $4, $5) RETURNING id, titulo, isbn, autor_id, total_exemplares, disponiveis',
      [
        livro.titulo,
        livro.isbn,
        livro.autor_id,
        livro.total_exemplares,
        livro.disponiveis
      ]
    )
    return row
  }

  async listarTodos(): Promise<Livro[]> {
    const { rows } = await this.pool.query<Livro>(
      'SELECT id, titulo, isbn, autor_id, total_exemplares, disponiveis FROM livro ORDER BY titulo ASC'
    )
    return rows
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      'SELECT id, titulo, isbn, autor_id, total_exemplares, disponiveis FROM livro WHERE id = $1',
      [id]
    )

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  async buscarPorIsbn(isbn: string): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      'SELECT id, titulo, isbn, autor_id, total_exemplares, disponiveis FROM livro WHERE isbn = $1',
      [isbn]
    )

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  async atualizar(id: number, livro: Omit<Livro, 'id'>): Promise<Livro | null> {
    const { rows } = await this.pool.query<Livro>(
      'UPDATE livro SET titulo = $1, isbn = $2, autor_id = $3, total_exemplares = $4, disponiveis = $5 WHERE id = $6 RETURNING id, titulo, isbn, autor_id, total_exemplares, disponiveis',
      [
        livro.titulo,
        livro.isbn,
        livro.autor_id,
        livro.total_exemplares,
        livro.disponiveis,
        id
      ]
    )

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  async remover(id: number): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM livro WHERE id = $1', [
      id
    ])
    return (result.rowCount ?? 0) > 0
  }
}
