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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
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
    plugins: {},
  };
  const data = {
    labels,
    datasets: [
      {
        label: "price",
        data: values,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Line options={options} data={data} height={"80%"} />;
};
