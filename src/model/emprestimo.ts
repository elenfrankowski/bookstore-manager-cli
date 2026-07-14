export type StatusEmprestimo = 'ATIVO' | 'DEVOLVIDO' | 'CANCELADO'

export interface Emprestimo {
  id?: number
  livro_id: number
  cliente_id: number
  data_emprestimo?: Date
  data_devolucao?: Date | null
  status: StatusEmprestimo
}

export interface EmprestimoDetalhado {
  id: number
  livro_titulo: string
  cliente_nome: string
  data_emprestimo: Date
  data_devolucao: Date | null
  status: StatusEmprestimo
}
