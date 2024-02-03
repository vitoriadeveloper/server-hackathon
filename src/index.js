const express = require("express");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const routes = require("./routes");
const app = express();
const conn = require("./db/conn");
const swaggerDocs = require("./swagger.json");
const PORTA = 8000;
const path = require("path");

conn();

app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/imagens", express.static(path.join(__dirname, "..", "uploads")));
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
