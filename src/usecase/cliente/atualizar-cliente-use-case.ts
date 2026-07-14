import { Cliente } from '../../model/cliente'
import { ClienteRepository } from '../../repositories/cliente-repository'

export class AtualizarClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async executar(
    id: number,
    nome: string,
    sobrenome: string,
    email: string
  ): Promise<Cliente> {
    const nomeLimpo = nome.trim()
    const sobrenomeLimpo = sobrenome.trim()
    const emailLimpo = email.trim().toLowerCase()

    if (!nomeLimpo || !sobrenomeLimpo || !emailLimpo) {
      throw new Error(
        'Todos os campos (nome, sobrenome e email) devem ser preenchidos.'
      )
    }

    const clienteExiste = await this.clienteRepository.buscarPorId(id)
    if (!clienteExiste) {
      throw new Error('Cliente não encontrado para atualização')
    }

    const emailDuplicado =
      await this.clienteRepository.buscarPorEmail(emailLimpo)
    if (emailDuplicado && emailDuplicado.id !== id) {
      throw new Error(
        'Este endereço de email já está em uso por outro cliente.'
      )
    }

    const clienteAtualizado = await this.clienteRepository.atualizar(id, {
      nome: nomeLimpo,
      sobrenome: sobrenomeLimpo,
      email: emailLimpo
    })
    if (!clienteAtualizado) {
      throw new Error('Não foi possível atualizar o cliente.')
    }

    return clienteAtualizado
  }
}
