const mongoose = require("mongoose");

const { Schema } = mongoose;

const projetoSchema = new Schema(
    {
        usuario_id: {
            type: String,
            required: true,
        },
        titulo: {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        descricao: {
            type: String,
            required: true,
        },
        imagem_url: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Projeto = mongoose.model("Projeto", projetoSchema);

module.exports = Projeto;
