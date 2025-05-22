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
// Lista de 16 capacitores comerciais
const capacitores = [1, 1, 2, 2, 2.5, 2.5, 5, 5, 5, 7.5, 10, 15, 20, 100, 100, 200];

function gerarCombinacoes(valores) {
    const n = valores.length;
    const combinacoes = [];

    for (let i = 1; i < (1 << n); i++) {
        const combinacao = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) combinacao.push({ valor: valores[j], index: j });
        }
        combinacoes.push(combinacao);
    }

    return combinacoes;
}

function encontrarMelhorCombinacao(alvo) {
    const combinacoes = gerarCombinacoes(capacitores);
    let melhor = null;
    let erroMin = Infinity;

    for (const c of combinacoes) {
        const soma = c.reduce((a, b) => a + b.valor, 0);
        const erro = Math.abs(soma - alvo);
        if (erro < erroMin) {
            erroMin = erro;
            melhor = c;
        }
    }

    const soma = melhor.reduce((a, b) => a + b.valor, 0);
    const binario = Array(capacitores.length).fill(0);
    melhor.forEach(el => binario[el.index] = 1);

    return {
        combinacao: melhor.map(c => c.valor),
        soma,
        bin: binario.reverse().join("")
    };
}

app.post("/salvar", (req, res) => {
    const dados = req.body;

    if (!dados.tensao || !dados.corrente || !dados.fp || !dados.watts || !dados.kva || !dados.kvar || !dados.xc || !dados.cap) {
        return res.status(400).send({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const resultado = encontrarMelhorCombinacao(parseFloat(dados.kvar));

    const sql = `
        INSERT INTO medidas 
        (tensao, corrente, fp, watts, kva, kvar, xc, capacitancia, correcao, binario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [
        dados.tensao, dados.corrente, dados.fp, dados.watts, dados.kva,
        dados.kvar, dados.xc, dados.cap,
        resultado.soma.toFixed(2), resultado.bin
    ];

    db.query(sql, valores, (err) => {
        if (err) {
            console.error("Erro ao salvar dados:", err);
            return res.status(500).send({ mensagem: "Erro ao salvar dados" });
        }
        res.status(200).send({ mensagem: "Dados salvos com sucesso com correção!" });
    });
});



// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
