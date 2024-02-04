const { z } = require("zod");
const { Projeto } = require("../models/Projetos");
const fs = require("fs");
const Usuario = require("../models/Usuarios");

const projetosController = {
    create: async (req, res) => {
        try {
            const projetosSchema = z.object({
                titulo: z.string().max(100),
                tags: z.string(),
                link: z.string(),
                descricao: z.string().max(300),
            });
            console.log(req.body);

            const { titulo, tags, link, descricao } = projetosSchema.parse(
                req.body,
            );
            const {
                0: { _id: idUsuarioLogado },
            } = req.usuarioLogado;

            if (!titulo || !tags || !link || !descricao) {
                return res
                    .status(400)
                    .json({ message: "Todos os campos são obrigatórios" });
            }
            if (!req.file) {
                return res
                    .status(400)
                    .json({ message: "Arquivo de imagem obrigatório" });
            }

            const { mimetype, path } = req.file;

            const projeto = await Projeto.create({
                usuario_id: idUsuarioLogado,
                titulo,
                tags,
                link,
                descricao,
                imagem_url: path,
                imagem_mimeType: mimetype,
                createdAt: new Date().toISOString(),
            });

            return res.status(201).json(projeto);
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: "Erro interno do servidor.",
            });
        }
    },
    get: async (req, res) => {
        try {
            const usuarios = await Usuario.find().select("-senha_hash");
            const listarProjetos = await Projeto.find();
            const usuarioPorId = {};
            usuarios.forEach((usuario) => {
                usuarioPorId[usuario._id] = usuario;
            });
            const projetos = listarProjetos.map((projeto) => {
                const usuario = usuarioPorId[projeto.usuario_id];
                return {
                    ...projeto._doc,
                    usuario,
                };
            });
            return res.status(200).json(projetos);
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
            titulo: z.string(),
            tags: z.array(z.string()),
            link: z.string(),
            descricao: z.string().max(300),
        });

        const {
            0: { _id: idUsuarioLogado },
        } = req.usuarioLogado;
        const { id: projetoId } = req.params;

        const { titulo, tags, link, descricao } = projetosSchema.parse(
            req.body,
        );
        const tagsArray = Object.values(req.body.tags);
        if (!projetoId) {
            return res
                .status(403)
                .json({ mensagem: "Id de produto não fornecido" });
        }
        if (!titulo || !tags || !link || !descricao) {
            return res
                .status(400)
                .json({ message: "Todos os campos devem ser preenchidos" });
        }
        try {
            const buscarProjeto = await Projeto.find({ _id: projetoId });

            if (!buscarProjeto[0]) {
                return res.status(400).json({
                    message: "Projeto não localizado na base de dados",
                });
            }
            const { mimetype, path: caminhoImagemAtual } = req.file;
            const path = buscarProjeto[0].imagem_url;

            fs.unlinkSync(path);

            await Projeto.updateOne(
                { usuario_id: idUsuarioLogado },
                {
                    $set: {
                        titulo,
                        tags: tagsArray,
                        link,
                        descricao,
                        imagem_url: caminhoImagemAtual,
                        imagem_mimeType: mimetype,
                    },
                },
            );
            return res.status(201).json();
        } catch (error) {
            res.status(500).json({
                message: "Erro ao atualizar projeto",
            });
        }
    },
    delete: async (req, res) => {
        const {
            0: { _id: idUsuarioLogado },
        } = req.usuarioLogado;
        const { id: projetoId } = req.params;
        try {
            const buscarProjeto = await Projeto.find({ _id: projetoId });

            if (
                buscarProjeto[0].usuario_id.toString() !==
                idUsuarioLogado.toString()
            ) {
                return res.status(403).json({
                    message: "Você não tem permissão para deletar este projeto",
                });
            }
            const path = buscarProjeto[0].imagem_url;

            fs.unlinkSync(path);
            await Projeto.deleteOne({ _id: projetoId });
            return res.status(200).json();
        } catch (error) {
            res.status(500).json({
                message: "Erro ao exluir projeto.",
            });
        }
    },
};

module.exports = projetosController;
