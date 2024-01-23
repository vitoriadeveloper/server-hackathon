const router = require("express").Router();

const projetosRouter = require("./projetos");

router.use("/", projetosRouter);

module.exports = router;
