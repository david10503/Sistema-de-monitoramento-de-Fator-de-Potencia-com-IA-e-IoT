import { carregarDados } from "../script.js";

async function gerarGrafico() {
  const num = new Array(7);

  for (let i = 0; i < 7; i++) {
    const valores = await carregarDados(); // chama a API a cada dia simulado
    num[i] = valores.fp;
  }

  console.log(num); // Exibe os valores coletados

  const ctx = document.getElementById('graficoLinha').getContext('2d');

  const graficoLinha = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Fator de Potência (fp)',
        data: num,
        fill: false,
        borderColor: 'rgb(146, 99, 255)',
        tension: 0.3,
        pointBackgroundColor: 'white',
        pointBorderColor: 'rgb(3, 3, 5)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Fator de Potência - Semana',
          font: {
            size: 20
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Fator de Potência'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Dia da Semana'
          }
        }
      }
    }
  });
}

gerarGrafico(); // Inicia tudo

