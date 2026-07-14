export interface LivroMaisEmprestado {
  livro_id: number
  titulo: string
  total_emprestimos: number
}

export interface ClienteMaisAtivo {
  cliente_id: number
  nome_completo: string
  total_emprestimos: number
}

export interface LivroDisponivel {
  id: number
  titulo: string
  isbn: string
  disponiveis: number
}

export interface LivroEmprestado {
  id: number
  titulo: string
  cliente_nome: string
  data_emprestimo: Date
}

export interface LivrosPorAutor {
  autor_id: number
  autor_nome: string
  total_livros: number
}

export interface EmprestimosPorLivro {
  livro_id: number
  titulo: string
  total_emprestimos: number
}

export interface ClienteComEmprestimoAtivo {
  cliente_id: number
  nome_completo: string
  total_emprestimos_ativos: number
}
