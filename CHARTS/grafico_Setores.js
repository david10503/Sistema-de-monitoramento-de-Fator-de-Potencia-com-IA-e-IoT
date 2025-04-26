const ctx = document.getElementById('grafico_Setores').getContext('2d');

  const graficoPolar = new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: ['Potência Ativa (W)', 'Potência Reativa (kVAr)', 'Potência Aparente (kVA)'],
      datasets: [{
        label: 'Grandezas Elétricas',
        data: [32, 150, 370],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Potências do Sistema Elétrico'
        },
        legend: {
          position: 'right'
        }
      }
    }
  });