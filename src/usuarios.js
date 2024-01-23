const router = require("express").Router();

const usuariosController = require("./controllers/usuariosController");

router
    .route("/cadastrar")
    .post((req, res) => usuariosController.create(req, res));
router.route("/login").post((req, res) => usuariosController.login(req, res));

module.exports = router;
