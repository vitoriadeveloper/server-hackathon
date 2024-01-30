const router = require("express").Router();
const projetosController = require("../controllers/projetosController");
const upload = require("../../config/multer");

router
    .route("/cadastrar")
    .post(upload.single("file"), (req, res) =>
        projetosController.create(req, res),
    );
router.route("/").get(projetosController.get);
router.route("/meus-projetos").get(projetosController.getMyProjects);
router
    .route("/atualizar-projeto/:id")
    .put(upload.single("file"), (req, res) => projetosController.put(req, res));
router.route("/meus-projetos/:id").delete(projetosController.delete);

module.exports = router;
