const router = require('express').Router()

const { autenticacao } = require('./middleware/auth')
const projetosRouter = require('./projetos')
const usuariosRouter = require('./usuarios')

router.use('/usuarios', usuariosRouter)
router.use(autenticacao)
router.use('/projetos', projetosRouter)

module.exports = router
