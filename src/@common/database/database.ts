import * as dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

export const pool = new Pool({
  user: globalThis.process.env.DB_USER ?? 'admin',
  host: globalThis.process.env.DB_HOST ?? 'localhost',
  database: globalThis.process.env.DB_NAME ?? 'bookstore-db',
  password: globalThis.process.env.DB_PASSWORD ?? '',
  port: Number(globalThis.process.env.DB_PORT ?? 5433),
  max: 10,
  min: 2
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export async function initDatabase() {
  console.log('Iniciando banco de dados...')
  await pool.query('SELECT 1')
  console.log('Banco de dados iniciado com sucesso!')
}
