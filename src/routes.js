
import * as path from 'path'
import { readFile } from 'fs/promises'
import { pool_Config } from './database/db.js'
import { calcularCoordenadas } from './util.js'
import HttpStatus from 'http-status-codes' 

const endereco_DDL = path.join('src/ddl.sql')

export const useRoutes = async (app) => {
  try {
    const ddl_Script = await readFile(endereco_DDL, 'utf8')
    // Executa o script DDL ao iniciar o servidor
    await pool_Config.query(ddl_Script)
    console.log('Script DDL executado com sucesso!')
  } catch (error) {
    console.error('Erro ao executar o script DDL', error)
  }

  // Localização fixa 
  const localizacaoFixa = {
    latitude: -23.504651623200193,
    longitude: -46.802845568928035
  }

  // Middleware de tratamento de erros
  app.use((err, req, res, next) => {
    console.error('Erro:', err)
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'O Erro está sendo interno do servidor' })
  })

  // Busca de todos clientes
  app.get('/clientes', async (req, res, next) => {
    try {
      const result = await pool_Config.query('SELECT * FROM clientes')
      res.status(HttpStatus.OK).json(result.rows)
    } catch (error) {
      console.error('Erro ao buscar clientes', error)
      next(error)
    }
  })

  // Cria novo cliente
  app.post('/clientes', async (req, res, next) => {
    const { nome, email, telefone, latitude, longitude } = req.body
    try {
      const result = await pool_Config.query(
        'INSERT INTO clientes (nome, email, telefone, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nome, email, telefone, latitude, longitude]
      )
      res.status(HttpStatus.CREATED).json(result.rows[0])
    } catch (error) {
      console.error('Erro ao cadastrar cliente', error)
      next(error)
    }
  })

  app.get('/calcular-distancia', async (_, res, next) => {
    try {
      const result = await pool_Config.query('SELECT * FROM clientes')
      const clientes = result.rows

      // Chama a função para calcular a distancia
      const distancia_calaculada = calcularCoordenadas(clientes, localizacaoFixa)

      // Retorna a distancia calculada como resposta
      res.status(HttpStatus.OK).json(distancia_calaculada)
    } catch (error) {
      console.error('Erro ao calcular rota', error)
      next(error)
    }
  })

  // Rota para filtrar clientes com base em parâmetros de consulta
  app.get('/filtrar-clientes', async (req, res, next) => {
    try {
      const { nome, email, telefone } = req.query
      let queryString = 'SELECT * FROM clientes WHERE 1 = 1'
      const queryParams = []

      if (nome) {
        queryString += ' AND nome ILIKE $1'
        queryParams.push(`%${nome}%`)
      }

      if (email) {
        queryString += ' AND email ILIKE $2'
        queryParams.push(`%${email}%`)
      }

      if (telefone) {
        queryString += ' AND telefone ILIKE $3'
        queryParams.push(`%${telefone}%`)
      }

      const result = await pool_Config.query(queryString, queryParams)
      res.json(result.rows)
    } catch (error) {
      console.error('Erro ao filtrar clientes', error)
      next(error)
    }
  })
}
