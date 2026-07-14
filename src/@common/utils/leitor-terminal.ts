import readline from 'readline'

export class LeitorTerminal {
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  async question(texto: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(texto, (resposta) => {
        resolve(resposta)
      })
    })
  }

  fechar() {
    this.rl.close()
  }
}
