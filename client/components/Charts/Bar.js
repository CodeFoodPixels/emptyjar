import React, { useState, useEffect } from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  Hint,
  VerticalBarSeries
} from "react-vis";
import { throttle } from "../../helpers";

import "react-vis/dist/style.css";
const stylesheet = getComputedStyle(document.documentElement);

const colors = [
  stylesheet.getPropertyValue("--primary-color"),
  stylesheet.getPropertyValue("--secondary-color")
];

const Bar = ({ data, title, maxWidth = 450 }) => {
  const [crosshairData, setCrosshairData] = useState({});

  const [graphWidth, setGraphWidth] = useState(
    Math.min(document.documentElement.clientWidth - 30, maxWidth)
  );

  useEffect(() => {
    const _onResize = throttle(() => {
      setGraphWidth(
        Math.min(document.documentElement.clientWidth - 30, maxWidth)
      );
    }, 250);

    window.addEventListener("resize", _onResize);

    return () => {
      window.removeEventListener("resize", _onResize);
    };
  });

  function _onMouseLeave() {
    setCrosshairData({});
  }

  function _onNearestX(value, { index }) {
    const body = Object.keys(data[value.x]).map(key => (
      <p key={key}>
        <b>{key}:</b> {data[value.x][key]}
      </p>
    ));

    setCrosshairData({
      value,
      text: (
        <div className="charts__tooltip">
          <h3>{value.x}</h3>
          {body}
        </div>
      )
    });
  }

  function buildBars() {
    if (!data) {
      return null;
    }

    return Object.keys(data)
      .reduce((acc, xVal) => {
        Object.keys(data[xVal]).forEach((key, i) => {
          if (!acc[i]) {
            acc[i] = [];
          }

          acc[i].push({ x: xVal, y: data[xVal][key] });
        });

        return acc;
      }, [])
      .map((dataSet, i) => {
        return (
          <VerticalBarSeries
            onNearestX={i === 0 ? _onNearestX : undefined}
            y0={200}
            data={dataSet}
            key={i}
            color={colors[i]}
          />
        );
      });
  }

  return (
    <div className="charts__chart">
      <h2 className="charts__title">{title}</h2>
      <XYPlot
        xType="ordinal"
        onMouseLeave={_onMouseLeave}
        width={graphWidth}
        height={300}
      >
        <HorizontalGridLines />
        <XAxis />
        <YAxis tickTotal={10} />
        {buildBars()}
        {crosshairData.value ? (
          <Hint value={crosshairData.value}>{crosshairData.text}</Hint>
        ) : null}
      </XYPlot>
    </div>
  );
};

Bar.displayName = "Bar";

export default Bar;
