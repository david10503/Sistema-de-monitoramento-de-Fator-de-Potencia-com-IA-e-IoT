const capacitores = [1, 2, 2.5, 5, 7.5, 10, 15, 20]; // valores em kVAr

function gerarCombinacoes(valores) {
    let combinacoes = [];
    const n = valores.length;

    for (let i = 1; i < (1 << n); i++) {
        let combinacao = [];
        for (let j = 0; j < n; j++) {
            if (i & (1 << j)) combinacao.push(valores[j]);
        }
        combinacoes.push({ combinacao, bin: i.toString(2).padStart(n, "0") });
    }

    return combinacoes;
}

export function encontrarMelhorCombinacao(alvo) {
    const combinacoes = gerarCombinacoes(capacitores);

    let melhor = null;
    let erroMin = Infinity;

    for (let { combinacao, bin } of combinacoes) {
        const soma = combinacao.reduce((a, b) => a + b, 0);
        const erro = Math.abs(soma - alvo);
        if (erro < erroMin) {
            erroMin = erro;
            melhor = { combinacao, bin, soma };
        }
    }

    return melhor;
}
