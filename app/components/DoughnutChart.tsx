'use client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: 'Banks',
        data: [3410, 4561, 897],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ],
    labels: ['Chase', 'Bank of America', 'Wells Fargo']
  }
  return (
    <Doughnut 
      data={data} 
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: '50%'
      }}
    />
  )
}

export default DoughnutChart;