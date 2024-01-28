const router = require("express").Router();

const { autenticacao } = require("./middleware/auth");
const projetosRouter = require("./routes/projetos");
const usuariosRouter = require("./routes/usuarios");

router.use("/usuarios", usuariosRouter);
router.use(autenticacao);
router.use("/projetos", projetosRouter);

module.exports = router;
