import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getIncomes, getExpenses } from '../api';
import { useData } from '../context/DataContext';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CashFlowChart = () => {
  const { tick } = useData();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Entrées (Ar)',
        data: [],
        backgroundColor: '#00d2d3', // Accent color (Cyan)
        borderRadius: 8,
      },
      {
        label: 'Sorties (Ar)',
        data: [],
        backgroundColor: '#6c5ce7', // Primary color (Purple)
        borderRadius: 8,
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const params = { start: sixMonthsAgo.toISOString().split('T')[0] };

        const [incomes, expenses] = await Promise.all([
            getIncomes(params),
            getExpenses(params)
        ]);

        const monthlyData = {};

        incomes.forEach(item => {
            const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
            monthlyData[month].income += parseFloat(item.amount);
        });

        expenses.forEach(item => {
            if (!item.date) return;
            const month = new Date(item.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
            monthlyData[month].expense += parseFloat(item.amount);
        });

        const labels = Object.keys(monthlyData);
        const incomeData = labels.map(month => monthlyData[month].income);
        const expenseData = labels.map(month => monthlyData[month].expense);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Entrées (Ar)',
              data: incomeData,
              backgroundColor: '#00d2d3',
              borderRadius: 8,
            },
            {
              label: 'Sorties (Ar)',
              data: expenseData,
              backgroundColor: '#6c5ce7',
              borderRadius: 8,
            },
          ],
        });
      } catch (error) {
        console.error("Erreur de récupération des données du graphique :", error);
      }
    };
    fetchChartData();
  }, [tick]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          color: '#5f6368', 
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } 
        }
      },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#a4b0be', 
          font: { family: 'Plus Jakarta Sans', size: 10 } 
        }
      },
      x: {
        grid: { display: false },
        ticks: { 
          color: '#a4b0be', 
          font: { family: 'Plus Jakarta Sans', size: 10 } 
        }
      }
    },
  };

  return (
    <div className="chart-container">
      <h3>📈 Flux de trésorerie mensuel</h3>
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CashFlowChart;
