const router = require("express").Router();

const projetosController = require("./controllers/projetosController");

router
    .route("/cadastrar")
    .post((req, res) => projetosController.create(req, res));
router.route("/").get((req, res) => projetosController.get(req, res));
router
    .route("/meus-projetos")
    .get((req, res) => projetosController.getMyProjects(req, res));

module.exports = router;
