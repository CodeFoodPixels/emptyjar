import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  Crosshair,
  LineMarkSeries
} from "react-vis";
import { throttle } from "../../helpers";

import "../../../../node_modules/react-vis/dist/style.css";

const TimeSeries = ({ data, title, groupBy, maxWidth = 490 }) => {
  let yMax = 0;

  const startDate = data.reduce((earliestDate, hit) => {
    const hitDate = new Date(hit.timestamp * 1000);
    hitDate.setUTCHours(0, 0, 0, 0);

    if (hitDate < earliestDate) {
      return hitDate;
    }

    return earliestDate;
  }, new Date());

  const numDays = Math.ceil((Date.now() - startDate.valueOf()) / 86400000);

  const hitTemplate = [];

  for (let i = 0; i < numDays; i++) {
    hitTemplate.push({
      x: new Date(startDate.valueOf() + 86400000 * i),
      y: 0
    });
  }

  const processedData = data.reduce((accumulator, hit) => {
    const grouping = groupBy ? hit[groupBy] : "Hits";

    const hitDate = new Date(hit.timestamp * 1000);
    hitDate.setUTCHours(0, 0, 0, 0);

    if (!accumulator[grouping]) {
      accumulator[grouping] = hitTemplate.map(obj => ({ ...obj }));
    }

    let dateObject = accumulator[grouping].find(element => {
      return element.x.toString() === hitDate.toString();
    });

    dateObject.y += 1;

    if (dateObject.y > yMax) {
      yMax = dateObject.y;
    }

    return accumulator;
  }, {});

  const [crosshairData, setCrosshairData] = useState({});

  const [graphWidth, setGraphWidth] = useState(
    Math.min(document.documentElement.clientWidth - 10, maxWidth)
  );

  useEffect(() => {
    const _onResize = throttle(() => {
      setGraphWidth(
        Math.min(document.documentElement.clientWidth - 10, maxWidth)
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
    const text = Object.keys(processedData)
      .map(key => ({
        key,
        value: processedData[key][index].y
      }))
      .filter(({ value }) => value > 0)
      .sort((a, b) => (a.value !== b.value ? a.value < b.value : a.key > b.key))
      .map(({ key, value }) => {
        return (
          <p key={key}>
            <b>{key}:</b> {value}
          </p>
        );
      });

    setCrosshairData({
      value,
      text: (
        <div className="charts__tooltip">
          <h3>{`${value.x.getFullYear()}-${(value.x.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${value.x.getDate()}`}</h3>
          {text}
        </div>
      )
    });
  }

  function buildLines() {
    return Object.values(processedData).map((data, i) => {
      return (
        <LineMarkSeries
          onNearestX={i === 0 ? _onNearestX : undefined}
          data={data}
          key={i}
        />
      );
    });
  }

  return (
    <div className="charts__chart">
      <h2>{title}</h2>
      <XYPlot
        xType="time-utc"
        onMouseLeave={_onMouseLeave}
        width={graphWidth}
        height={300}
        yDomain={[0, Math.ceil(yMax * 1.2)]}
        xDomain={
          hitTemplate.length
            ? [
                hitTemplate[0].x,
                new Date(
                  hitTemplate[hitTemplate.length - 1].x.valueOf() + 43200000
                )
              ]
            : []
        }
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis tickTotal={hitTemplate.length} />
        <YAxis />
        {buildLines()}
        <Crosshair values={[crosshairData.value]}>
          {crosshairData.text}
        </Crosshair>
      </XYPlot>
    </div>
  );
};

TimeSeries.displayName = "TimeSeries";

export default connect(({ data }) => ({
  data
}))(TimeSeries);
