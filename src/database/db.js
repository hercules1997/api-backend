import dotenv from "dotenv"
dotenv.config()

import pkg from "pg"

const { Pool } = pkg

export const pool_Config = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
})
