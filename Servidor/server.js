const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path"); // Importando o módulo path

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public"))); // Corrigido aqui

// Configuração do MySQL
const db = mysql.createConnection({
    host: "localhost", // Ou o IP do seu servidor MySQL
    user: "root", // Usuário do banco
    password: "1234", // Senha do banco
    database: "fator_potencia" // Nome do banco de dados
});

// Conexão ao MySQL
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        process.exit(1); // Encerra o servidor caso não consiga conectar ao banco
    } else {
        console.log("Conectado ao MySQL");
    }
});

// Rota para salvar os dados do ESP32
app.post("/salvar", (req, res) => {
    const dados = req.body;

    // Validação dos dados recebidos
    if (!dados.tensao || !dados.corrente || !dados.fp || !dados.watts || !dados.kva || !dados.kvar || !dados.xc || !dados.cap) {
        return res.status(400).send({ mensagem: "Todos os campos são obrigatórios!" });
    }

    console.log("Dados recebidos:", dados);

    // Query SQL para inserir os dados
    const sql = "INSERT INTO medidas (tensao, corrente, fp, watts, kva, kvar, xc, capacitancia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [dados.tensao, dados.corrente, dados.fp, dados.watts, dados.kva, dados.kvar, dados.xc, dados.cap], (err, result) => {
        if (err) {
            console.error("Erro ao salvar dados:", err);
            return res.status(500).send({ mensagem: "Erro ao salvar dados" });
        }
        res.status(200).send({ mensagem: "Dados salvos com sucesso!" });
    });
});

// Rota GET /analise
app.get("/analise", (req, res) => {
    const sqlMedia = `
        SELECT 
            AVG(tensao) AS media_tensao,
            AVG(corrente) AS media_corrente,
            AVG(fp) AS media_fp,
            AVG(watts) AS media_watts,
            AVG(kva) AS media_kva,
            AVG(kvar) AS media_kvar,
            AVG(xc) AS media_xc,
            AVG(capacitancia) AS media_capacitancia
        FROM (
            SELECT * FROM medidas
            ORDER BY id DESC
            LIMIT 30
        ) AS ultimas_30;
    `;

    const sqlModaHorario = `
        SELECT 
            HOUR(data_hora) AS hora_do_dia,
            COUNT(*) AS frequencia
        FROM medidas
        WHERE fp = (SELECT MAX(fp) FROM medidas)
        GROUP BY hora_do_dia
        ORDER BY frequencia DESC
        LIMIT 1;
    `;

    db.query(sqlMedia, (err, mediaResult) => {
        if (err) {
            console.error("Erro ao buscar média:", err);
            return res.status(500).send({ mensagem: "Erro ao buscar média" });
        }

        db.query(sqlModaHorario, (err2, modaResult) => {
            if (err2) {
                console.error("Erro ao buscar moda:", err2);
                return res.status(500).send({ mensagem: "Erro ao buscar moda" });
            }

            res.status(200).send({
                media: mediaResult[0],
                modaHorarioMaiorFP: modaResult[0]?.hora_do_dia ?? null
            });
        });
    });
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
