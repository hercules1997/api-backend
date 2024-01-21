import { readFile } from 'fs/promises'
import { pool_Config } from './database/db.js'
import HttpStatus from 'http-status-codes'
import { encontrarRotaMenorDistancia } from './util.js'
import { endereco_DDL } from './database/db.js'

//* ----------------------------------------------------------------------------------------------------- //

// Inicia as requisições das rodas e o script do DDL
export const useRoutes = async (app) => {
  try {
    try {
      const ddl_Script = await readFile(endereco_DDL, 'utf8')
      // Executa o script DDL ao iniciar o servidor
      await pool_Config.query(ddl_Script)
      console.log('Script DDL executado com sucesso!')
    } catch (error) {
      console.error('Erro ao executar o script DDL', error)
    }

    //* ----------------------------------------------------------------------------------------------------- //

    // Middleware de tratamento de erros
    app.use((err, req, res, next) => {
      console.error('Erro:', err)
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Erro interno do servidor' })
    })

    //* ----------------------------------------------------------------------------------------------------- //

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

    //* ----------------------------------------------------------------------------------------------------- //

    // Cria novos clientes
    app.post('/clientes', async (req, res, next) => {
      const { nome, email, telefone, x, y } = req.body
      try {
        const result = await pool_Config.query(
          'INSERT INTO clientes (nome, email, telefone, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [nome, email, telefone, x, y]
        )
        res.status(HttpStatus.CREATED).json(result.rows[0])
      } catch (error) {
        console.error('Erro ao cadastrar cliente', error)
        next(error)
      }
    })

    //* ----------------------------------------------------------------------------------------------------- //

    // app.post('/rotas', async (req, res, next) => {
    //      //TODO REALIZAR A INSERSÇÃO DAS ROTAS PARA A TABELA DE ROTAS
    // })

    //* ----------------------------------------------------------------------------------------------------- //

    // Rota para calcular a rota mais proxima
    app.get('/calcular-rota', async (_, res, next) => {
      try {
        const result = await pool_Config.query('SELECT * FROM clientes')
        const clientes = result.rows

        const empresa = {
          id: 0,
          nome: 'Facilita Clean',
          email: 'facilita@gmail.com',
          telefone: 123456789,
          x: 0,
          y: 0
        }

        // Adiciona a empresa à lista de clientes
        clientes.push(empresa)

        // Calcula a distância entre a empresa e cada cliente
        const distancias = clientes.map((i) => [i.x, i.y])

        const resu = encontrarRotaMenorDistancia(distancias)

        // Calcula a distância entre a empresa e cada cliente
        const rot = clientes.map((cliente) => {
          const pontoMaisProximo = resu.rota.find(
            (ponto) => ponto[0] === cliente.x && ponto[1] === cliente.y
          )

          return {
            cliente,
            ponto_proximo: pontoMaisProximo
          }
        })

        // Ordena a rota pelo menor caminho
        const rotOrdenadaMaisProxima = rot
          .sort((a, b) => {
            const pontoA = a.ponto_proximo
              ? resu.rota.indexOf(a.ponto_proximo)
              : -1
            const pontoB = b.ponto_proximo
              ? resu.rota.indexOf(b.ponto_proximo)
              : -1
            return pontoA - pontoB
          })
          .map((item) => item.cliente)

        res.json({ rotOrdenadaMaisProxima })
      } catch (error) {
        console.error('Erro ao calcular rota otimizada', error)
        res.status(500).json({ error: 'Erro ao calcular rota otimizada' })
      }
    }) //* ----------------------------------------------------------------------------------------------------- //

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
  } catch (error) {
    console.error('Erro ao chamar rota, tente novamente', error)
  }
}
