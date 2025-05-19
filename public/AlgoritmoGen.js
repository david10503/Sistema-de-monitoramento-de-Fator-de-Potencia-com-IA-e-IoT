const capacitores = [1, 2, 2.5, 5, 7.5, 10, 15, 20]; // valores em kVAr

function gerarCombinacoes(valores) {
    let combinacoes = [];
    const n = valores.length;

    for (let i = 1; i < (1 << n); i++) {
        let combinacao = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) combinacao.push(valores[j]);
        }
        combinacoes.push(combinacao);
    }

    return combinacoes;
}

export function mostraResultado(alvo) {
    const combinacoes = gerarCombinacoes(capacitores);

    let melhor = null;
    let erroMin = Infinity;

    for (let c of combinacoes) {
        let soma = c.reduce((a, b) => a + b, 0);
        let erro = Math.abs(soma - alvo);
        if (erro < erroMin) {
            erroMin = erro;
            melhor = c;
        }
    }

    console.log("Melhor combinação de capacitores:", melhor, "→", melhor.reduce((a, b) => a + b, 0).toFixed(2), "kVAr");

    document.getElementById("melhor_combinacao").innerText = `${melhor.join(" + ")} = ${melhor.reduce((a, b) => a + b, 0).toFixed(2)} kVAr`;
}