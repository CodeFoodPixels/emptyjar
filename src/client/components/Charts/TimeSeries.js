import React, { useState, useContext } from "react";
import State from "../../state";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  Crosshair,
  LineMarkSeries
} from "react-vis";

import "../../../../node_modules/react-vis/dist/style.css";

export default ({ title, groupBy }) => {
  const state = useContext(State.State);

  let yMax = 0;

  const startDate = state.data.reduce((earliestDate, hit) => {
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

  const data = state.data.reduce((accumulator, hit) => {
    const grouping = groupBy ? hit[groupBy] : 0;

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

  function _onMouseLeave() {
    setCrosshairData({});
  }

  function _onNearestX(value, { index }) {
    const text = Object.keys(data).reduce((accumulator, key) => {
      return (
        <>
          {accumulator}
          <p>
            <b>{key}:</b> {data[key][index].y}
          </p>
        </>
      );
    }, <h3>{`${value.x.getFullYear()}-${(value.x.getMonth() + 1).toString().padStart(2, "0")}-${value.x.getDate()}`}</h3>);

    setCrosshairData({
      value,
      text: <div className="chart__tooltip">{text}</div>
    });
  }

  function buildLines() {
    return Object.values(data).map((data, i) => {
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
    <div>
      <h3>{title}</h3>
      <XYPlot
        xType="time-utc"
        onMouseLeave={_onMouseLeave}
        width={500}
        height={300}
        yDomain={[0, Math.ceil(yMax * 1.2)]}
        xDomain={hitTemplate.length ? [hitTemplate[0].x, new Date(hitTemplate[hitTemplate.length - 1].x.valueOf() + 43200000)] : []}
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
