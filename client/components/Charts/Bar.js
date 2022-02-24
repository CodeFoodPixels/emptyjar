import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import Loader from "../Loader";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const stylesheet = getComputedStyle(document.documentElement);
const body = getComputedStyle(document.querySelector("body"));
ChartJS.defaults.font.size = parseInt(body.fontSize, 10);
ChartJS.defaults.color = body.color;

const colors = [
  {
    base: stylesheet.getPropertyValue("--primary-color"),
    hover: stylesheet.getPropertyValue("--primary-color--hover")
  },
  {
    base: stylesheet.getPropertyValue("--secondary-color"),
    hover: stylesheet.getPropertyValue("--secondary-color--hover")
  }
];

const BarChart = ({
  data: { labels, data },
  title,
  filter,
  loading = false
}) => {
  const chartRef = useRef();

  const onClick = e => {
    const { current: chart } = chartRef;

    const elements = getElementAtEvent(chart, e);
    if (elements.length === 0) {
      return;
    }

    const label = labels[elements[0].index];
    filter(label);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        mode: "index"
      }
    }
  };

  const chartData = {
    labels: labels,
    datasets: data.map((series, i) => {
      return {
        label: series.name,
        data: series.values,
        backgroundColor:
          i > colors.length ? colors[colors.length - 1].base : colors[i].base,
        hoverBackgroundColor:
          i > colors.length ? colors[colors.length - 1].hover : colors[i].hover
      };
    })
  };

  return (
    <div className="charts__chart">
      <h2 className="charts__title">{title}</h2>
      <div className="charts__chart-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <Bar
            ref={chartRef}
            options={options}
            data={chartData}
            onClick={onClick}
          />
        )}
      </div>
    </div>
  );
};

BarChart.displayName = "Bar";

export default BarChart;
