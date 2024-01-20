// Importa o Express.js
import bodyParser from "body-parser"
import express from "express"
import cors from 'cors'
import { useRoutes } from "./routes"

// Cria uma instância do aplicativo Express para trabalhar com roteamento
const app = express()
// Aplica o cors antes das suas rotas para as requisições
app.use(cors())
// Aplica o middleware body-parser ao aplicativo para que seja verificado se o lado do cliente será enviado dados no formato JSON
app.use(bodyParser.json())

// Define as rotas para o aplicativo
useRoutes(app)

// Define a porta na qual o servidor irá rodar
const PORT = process.env.PORT || 3002

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
