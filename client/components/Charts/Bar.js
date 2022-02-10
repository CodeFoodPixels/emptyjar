import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

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

const BarChart = ({ data: { labels, data }, title, maxWidth = 450 }) => {
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
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
};

BarChart.displayName = "Bar";

export default BarChart;
