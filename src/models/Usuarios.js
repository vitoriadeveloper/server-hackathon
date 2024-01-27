const mongoose = require("mongoose");

const { Schema } = mongoose;

const usuarioSchema = new Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        sobrenome: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        senha_hash: {
            type: String,
            required: false,
        },
        googleUserId: {
            type: String,
            required: false,
        },
    },
    { timestamps: true },
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
