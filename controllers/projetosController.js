const { Projeto: ProjetoModel } = require("../models/Projetos");

const projetosController = {
    create: async (req, res) => {
        try {
            const projeto = {
                usuario_id: req.body.usuario_id,
                titulo: req.body.titulo,
                tags: req.body.tags,
                link: req.body.link,
                descricao: req.body.descricao,
                imagem_url: req.body.imagem_url,
            };

            const projetoCriado = await ProjetoModel.create(projeto);

            res.status(201).json({
                projetoCriado,
                msg: "Projeto criado com sucesso.",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "Ocorreu um erro ao processar a requisição.",
            });
        }
    },
};

module.exports = projetosController;
