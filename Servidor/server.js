

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());





// Configuração do MySQL
const db = mysql.createConnection({
    host: "localhost", // Ou o IP do seu servidor MySQL
    user: "root", // Usuário do banco
    password: "1234", // Senha do banco
    database: "fator_potencia" // Nome do banco de dados
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
    } else {
        console.log("Conectado ao MySQL");
    }
});





// Rota para salvar os dados do ESP32
app.post("/salvar", (req, res) => {
    const dados = req.body;
    console.log("Dados recebidos:", dados);

    const sql = "INSERT INTO medidas (tensao, corrente, fp, watts, kva, kvar, xc, capacitancia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [dados.tensao, dados.corrente, dados.fp, dados.watts, dados.kva, dados.kvar, dados.xc, dados.cap], (err, result) => {
        if (err) {
            console.error("Erro ao salvar dados:", err);
            return res.status(500).send("Erro ao salvar dados");
        }
        res.status(200).send({ mensagem: "Dados salvos com sucesso!" });
    });
});




