const ctx = document.getElementById('graficoLinha').getContext('2d');

const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['10:00', '10:05', '10:10', '10:15', '10:20'], // Eixo X
        datasets: [{
            label: 'Tensão (V)',
            data: [220, 222, 219, 221, 223], // Eixo Y
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Gráfico de Tensão ao Longo do Tempo'
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});
