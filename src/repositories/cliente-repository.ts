import { Pool } from 'pg'

import { Cliente } from '../model/cliente'

export class ClienteRepository {
  constructor(private readonly pool: Pool) {}

  async criar(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const {
      rows: [row]
    } = await this.pool.query<Cliente>(
      'INSERT INTO cliente (nome, sobrenome, email) VALUES ($1, $2, $3) RETURNING id, nome, sobrenome, email',
      [cliente.nome, cliente.sobrenome, cliente.email]
    )
    return row
  }

  async listarTodos(): Promise<Cliente[]> {
    const { rows } = await this.pool.query<Cliente>(
      'SELECT id, nome, sobrenome, email FROM cliente ORDER BY nome ASC'
    )
    return rows
  }

  async buscarPorEmail(email: string): Promise<Cliente | null> {
    const { rows } = await this.pool.query<Cliente>(
      'SELECT id, nome, sobrenome, email FROM cliente WHERE email = $1',
      [email]
    )

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const { rows } = await this.pool.query<Cliente>(
      'SELECT id, nome, sobrenome, email FROM cliente WHERE id = $1',
      [id]
    )

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }
}
