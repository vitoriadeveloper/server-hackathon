const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const PORTA = 8000

const corsOptions = {
  origin: ['http://localhost:8000', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}

app.use(cors(corsOptions))
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Olá mundo')
})

const conn = require('./db/conn')
conn()

const routes = require('./routes')

app.use('/api', routes)

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`)
})
