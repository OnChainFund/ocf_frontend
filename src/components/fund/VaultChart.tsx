import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface Props {
  priceChartData: [];
}
export const VaultChart = (props: Props) => {
  const priceChartData = props.priceChartData;
  let labels = [];
  let values = [];
  for (let index = 0; index < priceChartData.length; index++) {
    labels.push(priceChartData[index]["date"]);
    values.push(priceChartData[index]["navPerShare"]);
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Price Chart",
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: "price",
        data: values,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} height={"80%"} />;
};
