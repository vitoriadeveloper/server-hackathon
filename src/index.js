const express = require("express");
require("dotenv").config();
const app = express();
const PORTA = 8000;

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Olá mundo");
});
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
