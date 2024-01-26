const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuarios");

const autenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    try {
        if (!authorization) {
            return res.status(401).json({ message: "Não autorizado" });
        }
        const token = authorization.split(" ")[1];

        const { id } = jwt.verify(token, process.env.SECURE_PASSWORD);

        const usuarioLogado = await Usuario.find({
            _id: id,
        });

        if (!usuarioLogado) {
            return res.status(401).json({ message: "Usuário não autorizado" });
        }
        const { senha_hash: _, ...dadosUsuarioLogado } = usuarioLogado;

        req.usuarioLogado = dadosUsuarioLogado;

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Erro de autenticação",
        });
    }
};
module.exports = {
    autenticacao,
};
