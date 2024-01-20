// Importação para a acesso ao .env, onde estarão as variáveis de ambientes
import dotenv from 'dotenv'
dotenv.config()

//* ----------------------------------------------------------------------------------------------------- //
import * as path from 'path'
import pkg from 'pg'

// Busca do arquivo ddl
export const endereco_DDL = path.join('src/ddl.sql')

const { Pool } = pkg
// Configuração para acesso ao banco de dados com variavéis de ambientes
export const pool_Config = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})
