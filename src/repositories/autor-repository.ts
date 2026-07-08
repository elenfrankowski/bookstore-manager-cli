import { Pool } from 'pg'

import { Autor } from '../model/autor'

export class AutorRepository {
  constructor(private readonly pool: Pool) {}

  async criar(autor: Omit<Autor, 'id'>): Promise<Autor> {
    const {
      rows: [row]
    } = await this.pool.query<Autor>(
      'INSERT INTO autor (nome) VALUES ($1) RETURNING id, nome',
      [autor.nome]
    )
    return row
  }

  async listarTodos(): Promise<Autor[]> {
    const { rows } = await this.pool.query<Autor>(
      'SELECT id, nome FROM autor ORDER BY nome ASC'
    )
    return rows
  }

  async buscarPorId(id: number): Promise<Autor | null> {
    const { rows } = await this.pool.query<Autor>(
      'SELECT id, nome FROM autor WHERE id = $1',
      [id]
    )
    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }
}
