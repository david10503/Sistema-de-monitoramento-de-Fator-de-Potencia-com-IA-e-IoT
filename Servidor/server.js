

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




// Inicia o servidor
app.listen(5000, port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Rota para análise dos piores momentos de fator de potência
app.get("/analise", (req, res) => {
    const sql = `
        SELECT 
            DAYNAME(data_hora) AS dia_semana,
            HOUR(data_hora) AS hora,
            COUNT(*) AS total_registros,
            AVG(fp) AS media_fp,
            SUM(fp < 0.9) AS ocorrencias_fp_baixo
        FROM medidas
        GROUP BY dia_semana, hora
        ORDER BY media_fp ASC
        LIMIT 10;
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error("Erro na análise:", err);
            return res.status(500).send("Erro ao realizar análise");
        }

        // Mapeia os resultados para uma resposta mais legível
        const analise = resultados.map(row => ({
            dia: row.dia_semana,
            hora: `${row.hora}:00`,
            media_fp: parseFloat(row.media_fp).toFixed(2),
            registros: row.total_registros,
            abaixo_de_0_9: row.ocorrencias_fp_baixo
        }));

        res.status(200).json({ analise });
    });
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




