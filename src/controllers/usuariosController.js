const bcrypt = require("bcrypt");
const { z } = require("zod");
const Usuario = require("../models/Usuarios");

const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const serviceAccount = require("../../firebaseAdmin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const usuarioController = {
    create: async (req, res) => {
        const usuarioSchema = z.object({
            nome: z.string(),
            sobrenome: z.string(),
            email: z.string().email({ message: "Email inválido" }),
            senha_hash: z.string().min(6, {
                message: "A senha deve conter pelo menos 6 caracteres",
            }),
        });
        try {
            const { nome, sobrenome, email, senha_hash } = usuarioSchema.parse(
                req.body,
            );
            if (senha_hash.length < 6) {
                return res.status(401).json({
                    message: "A senha deve conter pelo menos 6 caracteres",
                });
            }
            const senha = await bcrypt.hash(senha_hash, 10);
            const checarEmail = await Usuario.findOne({ email });

            if (checarEmail) {
                return res
                    .status(400)
                    .json({ message: "Email já cadastrado no sistema." });
            }
            const novoUsuario = new Usuario({
                nome,
                sobrenome,
                email,
                senha_hash: senha,
                googleUserId: email,
                createdAt: new Date().toISOString(),
            });

            await Usuario.create(novoUsuario);
            return res.status(201).json();
        } catch (error) {
            return res.status(500).json({
                message: "Erro interno do servidor",
            });
        }
    },
    login: async (req, res) => {
        const usuarioLoginSchema = z.object({
            email: z.string(),
            senha_hash: z.string().min(6),
        });

        try {
            const { email, senha_hash } = usuarioLoginSchema.parse(req.body);

            const usuarioEncontrado = await Usuario.findOne({ email });

            if (!usuarioEncontrado) {
                return res
                    .status(401)
                    .json({ message: "Email ou senha incorretos" });
            }
            const senhaCorreta = await bcrypt.compare(
                senha_hash,
                usuarioEncontrado.senha_hash,
            );

            if (!senhaCorreta) {
                return res
                    .status(401)
                    .json({ message: "Email ou senha incorretos" });
            }

            const token = jwt.sign(
                { id: usuarioEncontrado.id },
                process.env.SECURE_PASSWORD,
                {
                    expiresIn: "1h",
                },
            );

            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({
                message: "Erro interno do servidor",
            });
        }
    },
    loginComGoogle: async (req, res) => {
        const { googleToken } = req.body;
        try {
            const decodedToken = await admin.auth().verifyIdToken(googleToken);
            const { email, sub: googleUserId } = decodedToken;
            console.log(email, googleUserId);

            let usuarioEncontrado = await Usuario.findOne({ email });

            if (!usuarioEncontrado) {
                usuarioEncontrado = await Usuario.findOne({ googleUserId });
            }

            if (!usuarioEncontrado) {
                const novoUsuario = new Usuario({
                    nome: decodedToken.name,
                    email,
                    googleUserId,
                    createdAt: new Date(),
                });

                await Usuario.create(novoUsuario);
                usuarioEncontrado = novoUsuario;
            }

            const token = jwt.sign(
                { id: usuarioEncontrado.id },
                process.env.SECURE_PASSWORD,
                { expiresIn: "1h" },
            );

            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    },
};

module.exports = usuarioController;
