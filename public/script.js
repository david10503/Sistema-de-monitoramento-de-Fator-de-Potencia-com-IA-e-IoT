
import { encontrarMelhorCombinacao } from "./AlgoritmoGen.js";

async function carregarDados() {
    let valores;

    try {
        let response = await fetch("http://192.168.15.11/dados");
        let data = await response.json();

        let potenciaAtiva = calculaPotenciaAtiva(data.tensao, data.corrente);
        let potenciaAparente = calculaPotenciaAparente(potenciaAtiva, data.fp);
        let potenciaReativa = calculaPotenciaReativa(potenciaAparente, potenciaAtiva);
        let reatanciaCapacitiva = calculaReatanciaCapacitiva(data.tensao, potenciaReativa);
        let capacitancia = calculaCapacitancia(reatanciaCapacitiva);

        document.getElementById("tensao").innerText = data.tensao;
        document.getElementById("corrente").innerText = data.corrente;
        document.getElementById("fp").innerText = data.fp;
        document.getElementById("Watts").innerText = potenciaAtiva;
        document.getElementById("KVA").innerText = potenciaAparente;
        document.getElementById("KVAr").innerText = potenciaReativa;
        document.getElementById("Xc").innerText = reatanciaCapacitiva;
        document.getElementById("Capacitancia").innerText = capacitancia;

        class Valores {
            constructor(data, potenciaAtiva, potenciaAparente, potenciaReativa, reatanciaCapacitiva, capacitancia) {
                this.corrente = data.corrente;
                this.tensao = data.tensao;
                this.fp = data.fp;
                this.watts = potenciaAtiva;
                this.kva = potenciaAparente;
                this.kvar = potenciaReativa;
                this.xc = reatanciaCapacitiva;
                this.cap = capacitancia;
            }
        }

        valores = new Valores(data, potenciaAtiva, potenciaAparente, potenciaReativa, reatanciaCapacitiva, capacitancia);

        await salvarDados(valores);
        await calcularCorrecao();

        // Chama o algoritmo genético com valor de kVAr
        mostraResultado(parseFloat(valores.kvar));

        if (data.fp < 0.9) {
            console.log("Fator de potência baixo! Acionando saída...");
            acionarSaida(1);
        } else {
            acionarSaida(0);
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }

    return valores;
}

async function salvarDados(valores) {
    try {
        let response = await fetch("http://localhost:8080/salvar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valores)
        });

        let result = await response.json();
        console.log("Resposta do servidor:", result.mensagem);
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
    }
}







function calculaPotenciaAtiva(tensao, corrente) {
    return (tensao * corrente).toFixed(2);
}

function calculaPotenciaAparente(potenciaAtiva, fp) {
    if (fp == 0) return 0;
    return (potenciaAtiva / fp).toFixed(2);
}

function calculaPotenciaReativa(potenciaAparente, potenciaAtiva) {
    let reativa = Math.sqrt(Math.pow(potenciaAparente, 2) - Math.pow(potenciaAtiva, 2));
    return reativa.toFixed(2);
}

function calculaReatanciaCapacitiva(tensao, potenciaReativa) {
    if (potenciaReativa == 0) return 0;
    let reatancia = Math.pow(tensao, 2) / potenciaReativa;
    return reatancia.toFixed(2);
}

function calculaCapacitancia(reatanciaCapacitiva) {
    const frequencia = 60;
    if (reatanciaCapacitiva == 0) return 0;
    let capacitancia = 1 / (2 * Math.PI * frequencia * reatanciaCapacitiva);
    return (capacitancia * 1e6).toFixed(2);
}

async function acionarSaida(estado) {
    try {
        await fetch(`http://192.168.15.7/acionar?estado=${estado}`);
        console.log(`Saída ${estado == 1 ? "LIGADA" : "DESLIGADA"}`);
    } catch (error) {
        console.error("Erro ao acionar saída:", error);
    }
}

setInterval(carregarDados, 5000);
