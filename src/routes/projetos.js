const router = require("express").Router();

const projetosController = require("../controllers/projetosController");

router
    .route("/cadastrar")
    .post((req, res) => projetosController.create(req, res));
router.route("/").get((req, res) => projetosController.get(req, res));
router
    .route("/meus-projetos")
    .get((req, res) => projetosController.getMyProjects(req, res));
router
    .route("/atualizar-projeto/:id")
    .put((req, res) => projetosController.put(req, res));
router
    .route("/meus-projetos/:id")
    .delete((req, res) => projetosController.delete(req, res));

module.exports = router;
