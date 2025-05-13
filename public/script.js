

export async function carregarDados() {
    
    let valores;
   

    try {
        let response = await fetch("http://192.168.15.9/dados"); // Substitua pelo IP real do ESP32
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

        // Exemplo de como instanciar, assumindo que você já tenha essas variáveis:
        valores = new Valores(data, potenciaAtiva, potenciaAparente, potenciaReativa, reatanciaCapacitiva, capacitancia);
        
        // Salva os dados
        await salvarDados(valores);
        buscarAnalise();
       

        // Verifica se o fator de potência caiu abaixo de 0.9
        if (data.fp < 0.9) {
            console.log("Fator de potência baixo! Acionando saída...");
            acionarSaida(1);  // Liga a saída
        } else {
            acionarSaida(0);  // Desliga a saída
        }
    } catch (error) {
        console.error("Erro ao buscar os dados:", error);
    }

    return valores;
}

async function salvarDados(valores) {
    try {
        let response = await fetch("http://localhost:8080/salvar", {  // Correção do IP para localhost
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(valores)  // Passa os valores para salvar no backend
        });

        let result = await response.json();
        console.log("Resposta do servidor:", result.mensagem);
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
    }
}


async function buscarAnalise() {
    try {
        let response = await fetch("http://localhost:8080/analise");
        let data = await response.json();

        // Acessa as médias
        let media = data.media;
        console.log("Média das últimas 8 leituras:", media);

        // Acessa a moda do horário com maior FP
        let modaHorario = data.modaHorarioMaiorFP;
        console.log("Horário mais comum com maior FP:", modaHorario);

        // Exemplo de exibição no HTML
        document.getElementById("media_fp").innerText = media.media_fp.toFixed(2);
        document.getElementById("moda_horario").innerText = modaHorario + ":00";

    } catch (error) {
        console.error("Erro ao buscar análise:", error);
    }

    return modaHorario;
}


// Funções de cálculo (sem alterações)
function calculaPotenciaAtiva(tensao, corrente) {
    return (tensao * corrente).toFixed(2);
}

function calculaPotenciaAparente(potenciaAtiva, fp) {
    if (fp == 0) return 0; // Evita divisão por zero
    return (potenciaAtiva / fp).toFixed(2);
}

function calculaPotenciaReativa(potenciaAparente, potenciaAtiva) {
    let reativa = Math.sqrt(Math.pow(potenciaAparente, 2) - Math.pow(potenciaAtiva, 2));
    return reativa.toFixed(2);
}

function calculaReatanciaCapacitiva(tensao, potenciaReativa) {
    if (potenciaReativa == 0) return 0; // Evita divisão por zero
    let reatancia = Math.pow(tensao, 2) / potenciaReativa;
    return reatancia.toFixed(2);
}

function calculaCapacitancia(reatanciaCapacitiva) {
    const frequencia = 60; // Frequência da rede elétrica em Hz
    if (reatanciaCapacitiva == 0) return 0; // Evita divisão por zero
    let capacitancia = 1 / (2 * Math.PI * frequencia * reatanciaCapacitiva);
    return (capacitancia * 1e6).toFixed(2); // Convertendo de Farads para µF
}

// Função para acionar/desligar a saída do ESP32
async function acionarSaida(estado) {
    try {
        await fetch(`http://192.168.15.12/acionar?estado=${estado}`);
        console.log(`Saída ${estado == 1 ? "LIGADA" : "DESLIGADA"}`);
    } catch (error) {
        console.error("Erro ao acionar saída:", error);
    }
}

// Atualiza os dados a cada 10 segundos
setInterval(carregarDados, 10000);
