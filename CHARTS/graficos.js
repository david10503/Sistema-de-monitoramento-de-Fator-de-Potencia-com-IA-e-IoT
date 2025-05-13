/*import { carregarDados } from "../script.js";

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
*/



// Gráfico de Barras
async function gerarGrafico() {
new Chart(document.getElementById('graficoBarras'), {
  type: 'bar',
  data: {
    labels: ['Setor 1', 'Setor 2', 'Setor 3', 'Setor 4'],
    datasets: [{
      label: 'Consumo (kWh)',
      data: [12, 19, 7, 14],
      backgroundColor: '#00d1ff'
    }]
  },
  options: {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } }
    }
  }
});

// Gráfico de Linha
new Chart(document.getElementById('graficoLinha'), {
  type: 'line',
  data: {
    labels: ['00h', '06h', '12h', '18h', '00h'],
    datasets: [{
      label: 'kWh',
      data: [2, 3, 4.5, 3.2, 2.8],
      borderColor: '#50fa7b',
      backgroundColor: 'transparent',
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      x: { ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } }
    }
  }
});

// Gráfico de Pizza
new Chart(document.getElementById('graficoPizza'), {
  type: 'doughnut',
  data: {
    labels: ['Ativa', 'Reativa', 'Aparente'],
    datasets: [{
      data: [60, 25, 15],
      backgroundColor: ['#00d1ff', '#ff79c6', '#f1fa8c']
    }]
  },
  options: {
    plugins: { legend: { labels: { color: '#fff' } } }
  }
});
}

gerarGrafico();