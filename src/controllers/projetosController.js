const { z } = require("zod");
const { Projeto } = require("../models/Projetos");

const projetosController = {
    create: async (req, res) => {
        try {
            const projetosSchema = z.object({
                titulo: z.string().max(100),
                tags: z.array(z.string()),
                link: z.string(),
                descricao: z.string().max(300),
                imagem_url: z.string(),
            });
            const { titulo, tags, link, descricao, imagem_url } =
                projetosSchema.parse(req.body);
            const {
                0: { _id: idUsuarioLogado },
            } = req.usuarioLogado;

            if (!titulo || !tags || !link || !descricao || !imagem_url) {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios" });
            }

            await Projeto.create({
                usuario_id: idUsuarioLogado,
                titulo,
                tags,
                link,
                descricao,
                imagem_url,
                createdAt: new Date().toISOString(),
            });
            return res.status(201).json();
        } catch (error) {
            res.status(500).json({
                message: "Erro interno do servidor.",
            });
        }
    },
    get: async (req, res) => {
        try {
            const listarProjetos = await Projeto.find();
            return res.status(200).json(listarProjetos);
        } catch (error) {
            res.status(500).json({
                message: "Erro interno do servidor.",
            });
        }
    },
};

module.exports = projetosController;
