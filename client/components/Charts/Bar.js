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

const stylesheet = window.getComputedStyle(document.documentElement);
const body = window.getComputedStyle(document.querySelector("body"));
ChartJS.defaults.font.size = parseInt(body.fontSize || 16, 10);
ChartJS.defaults.color = body.color || "#000000";

const colors = [
  {
    base: stylesheet.getPropertyValue("--primary-color") || "#000000",
    hover: stylesheet.getPropertyValue("--primary-color--hover") || "#333333"
  },
  {
    base: stylesheet.getPropertyValue("--secondary-color") || "#666666",
    hover: stylesheet.getPropertyValue("--secondary-color--hover") || "#999999"
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
          i >= colors.length ? colors[colors.length - 1].base : colors[i].base,
        hoverBackgroundColor:
          i >= colors.length ? colors[colors.length - 1].hover : colors[i].hover
      };
    })
  };

  return (
    <div className="charts__chart">
      <h2 className="charts__title" data-testid="charts__title">
        {title}
      </h2>
      <div className="charts__chart-wrapper">
        {loading ? (
          <Loader />
        ) : (
          <Bar
            ref={chartRef}
            options={options}
            data={chartData}
            onClick={onClick}
            data-testid="charts__bar-chart"
          />
        )}
      </div>
    </div>
  );
};

BarChart.displayName = "Bar";

export default BarChart;
