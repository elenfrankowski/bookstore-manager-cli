import { Cliente } from '../../model/cliente'

import { ClienteRepository } from '../../repositories/cliente-repository'

export class CriarClienteUseCase {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async executar(
    nome: string,
    sobrenome: string,
    email: string
  ): Promise<Cliente> {
    const nomeLimpo = nome.trim()
    const sobrenomeLimpo = sobrenome.trim()
    const emailLimpo = email.trim().toLowerCase()

    if (!nomeLimpo || !sobrenomeLimpo || !emailLimpo) {
      throw new Error(
        'Todos os campos (nome, sobrenome e email) são obrigatórios.'
      )
    }

    const clienteExistente =
      await this.clienteRepository.buscarPorEmail(emailLimpo)
    if (clienteExistente) {
      throw new Error(
        'Já existe um cliente cadastrado com este endereço de email.'
      )
    }

    return this.clienteRepository.criar({
      nome: nomeLimpo,
      sobrenome: sobrenomeLimpo,
      email: emailLimpo
    })
  }
}
