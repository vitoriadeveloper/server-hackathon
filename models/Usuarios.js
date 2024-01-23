const mongoose = require("mongoose");

const { Schema } = mongoose;

const { projetoSchema } = require("./Projetos");

const usuarioSchema = new Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        sobrenome: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        senha_hash: {
            type: String,
            required: true,
        },
        projetos: {
            type: [projetoSchema],
        },
    },
    { timestamps: true },
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
