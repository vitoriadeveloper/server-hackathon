const { z } = require("zod");
const { Projeto } = require("../models/Projetos");
const { $where } = require("../models/Usuarios");

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
    getMyProjects: async (req, res) => {
        try {
            const {
                0: { _id: idUsuarioLogado },
            } = req.usuarioLogado;
            const listarMeusProjetos = await Projeto.find({
                usuario_id: idUsuarioLogado,
            });
            return res.status(200).json(listarMeusProjetos);
        } catch (error) {
            res.status(500).json({
                message: "Erro interno do servidor.",
            });
        }
    },
    put: async (req, res) => {
        const projetosSchema = z.object({
            titulo: z.string().max(100),
            tags: z.array(z.string()),
            link: z.string(),
            descricao: z.string().max(300),
            imagem_url: z.string(),
        });
        const {
            0: { _id: idUsuarioLogado },
        } = req.usuarioLogado;
        const { id: projetoId } = req.params;
        const { titulo, tags, link, descricao, imagem_url } =
            projetosSchema.parse(req.body);

        if (!projetoId) {
            return res
                .status(403)
                .json({ mensagem: "Id de produto não fornecido" });
        }
        if (!titulo || !tags || !link || !descricao || !imagem_url) {
            return res
                .status(400)
                .json({ message: "Todos os campos devem ser preenchidos" });
        }
        try {
            const buscarProjeto = await Projeto.find({ _id: projetoId });

            if (!buscarProjeto) {
                return res.status(400).json({
                    message: "Projeto não localizado na base de dados",
                });
            }

            await Projeto.updateOne(
                { usuario_id: idUsuarioLogado },
                {
                    $set: { titulo, tags, link, descricao, imagem_url },
                },
            );
            return res.status(201).json();
        } catch (error) {}
    },
};

module.exports = projetosController;
