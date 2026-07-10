import { Pool } from 'pg'

import {
  ClienteComEmprestimoAtivo,
  ClienteMaisAtivo,
  EmprestimosPorLivro,
  LivroDisponivel,
  LivroEmprestado,
  LivroMaisEmprestado,
  LivrosPorAutor
} from '../model/relatorio'

export class RelatorioRepository {
  constructor(private readonly pool: Pool) {}

  async obterLivrosDisponiveis(): Promise<LivroDisponivel[]> {
    const query = `
      SELECT id, titulo, isbn, disponiveis
      FROM livro
      WHERE disponiveis > 0
      ORDER BY titulo ASC
    `
    const { rows } = await this.pool.query<LivroDisponivel>(query)
    return rows
  }

  async obterLivrosEmprestados(): Promise<LivroEmprestado[]> {
    const query = `
      SELECT
        l.id,
        l.titulo,
        c.nome AS cliente_nome,
        e.data_emprestimo
      FROM emprestimo e
      INNER JOIN livro l ON l.id = e.livro_id
      INNER JOIN cliente c ON c.id = e.cliente_id
      WHERE e.status = 'ATIVO'
      ORDER BY e.data_emprestimo DESC
    `
    const { rows } = await this.pool.query<LivroEmprestado>(query)
    return rows
  }

  async obterLivrosPorAutor(): Promise<LivrosPorAutor[]> {
    const query = `
      SELECT
        a.id AS autor_id,
        a.nome AS autor_nome,
        COUNT(l.id)::int AS total_livros
      FROM autor a
      LEFT JOIN livro l ON l.autor_id = a.id
      GROUP BY a.id, a.nome
      ORDER BY total_livros DESC
    `
    const { rows } = await this.pool.query<LivrosPorAutor>(query)
    return rows
  }

  async obterEmprestimosPorLivro(): Promise<EmprestimosPorLivro[]> {
    const query = `
      SELECT
        l.id AS livro_id,
        l.titulo,
        COUNT(e.id)::int AS total_emprestimos
      FROM livro l
      LEFT JOIN emprestimo e ON e.livro_id = l.id
      GROUP BY l.id, l.titulo
      ORDER BY total_emprestimos DESC
    `
    const { rows } = await this.pool.query<EmprestimosPorLivro>(query)
    return rows
  }

  async obterClientesComEmprestimosAtivos(): Promise<
    ClienteComEmprestimoAtivo[]
  > {
    const query = `
      SELECT
        c.id AS cliente_id,
        CONCAT(c.nome, ' ', c.sobrenome) AS nome_completo,
        COUNT(e.id)::int AS total_emprestimos_ativos
      FROM cliente c
      INNER JOIN emprestimo e ON e.cliente_id = c.id
      WHERE e.status = 'ATIVO'
      GROUP BY c.id, c.nome, c.sobrenome
      ORDER BY total_emprestimos_ativos DESC
    `
    const { rows } = await this.pool.query<ClienteComEmprestimoAtivo>(query)
    return rows
  }

  async obterLivrosMaisEmprestados(): Promise<LivroMaisEmprestado[]> {
    const query = `
      SELECT
        l.id AS livro_id,
        l.titulo,
        COUNT(e.id)::int AS total_emprestimos
      FROM emprestimo e
      INNER JOIN livro l ON l.id = e.livro_id
      GROUP BY l.id, l.titulo
      ORDER BY total_emprestimos DESC
      LIMIT 5
    `
    const { rows } = await this.pool.query<LivroMaisEmprestado>(query)
    return rows
  }

  async obterClientesMaisAtivos(): Promise<ClienteMaisAtivo[]> {
    const query = `
      SELECT
        c.id AS cliente_id,
        CONCAT(c.nome, ' ', c.sobrenome) AS nome_completo,
        COUNT(e.id)::int AS total_emprestimos
      FROM emprestimo e
      INNER JOIN cliente c ON c.id = e.cliente_id
      GROUP BY c.id, c.nome, c.sobrenome
      ORDER BY total_emprestimos DESC
      LIMIT 5
    `
    const { rows } = await this.pool.query<ClienteMaisAtivo>(query)
    return rows
  }
}
