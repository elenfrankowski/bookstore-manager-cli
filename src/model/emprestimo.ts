export type StatusEmprestimo = 'ATIVO' | 'DEVOLVIDO' | 'CANCELADO'

export interface Emprestimo {
  id?: number
  livro_id: number
  cliente_id: number
  data_emprestimo?: Date
  data_devolucao?: Date | null
  status: StatusEmprestimo
}
