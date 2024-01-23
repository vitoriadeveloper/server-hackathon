const express = require("express");
require("dotenv").config();
const app = express();
const PORTA = 8000;

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Olá mundo");
});

const conn = require("../db/conn");

conn();

const routes = require("./routes");

app.use("/api", routes);

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
