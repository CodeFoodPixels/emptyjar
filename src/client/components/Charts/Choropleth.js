import React, { useEffect, useContext } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import State from "../../state";
import { scaleLinear } from "d3-scale";

export default () => {
  const state = useContext(State.State);

  const data = state.data.reduce((accumulator, hit) => {
    if (accumulator[hit.country]) {
      accumulator[hit.country] += 1;
    } else {
      accumulator[hit.country] = 1;
    }

    return accumulator;
  }, {});

  const highestNumber = Object.values(data).sort().reverse()[0];

  const popScale = scaleLinear()
    .domain([0, highestNumber || 1])
    .range(["#fff7ec","#7f0000"])

  useEffect(() => {
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  });

  function buildGeography(geography, projection, index) {
    const hits = data[geography.properties.ISO_A2] || 0;
    const tooltip = `
            <h3>${geography.properties.NAME}</h3>
            <p><b>Hits:</b> ${hits}</p>
        `;

    return (
      <Geography
        key={index}
        data-tip={tooltip}
        geography={geography}
        projection={projection}
        style={{
            default: {
                fill: popScale(hits),
                stroke: "#607D8B",
                strokeWidth: 0.75,
                outline: "none",
                },
                hover: {
                fill: popScale(hits),
                stroke: "#000000",
                strokeWidth: 1.5,
                outline: "none",
                },
                pressed: {
                fill: popScale(hits),
                stroke: "#000000",
                strokeWidth: 1.5,
                outline: "none",
                }
        }}
      />
    );
  }

  return (
    <div className="charts__chart">
      <h2>Hits by country</h2>
      <ComposableMap
        projectionConfig={{
          scale: 205,
          rotation: [-11, 0, 0]
        }}
        width={1000}
        height={562}
        style={{ width: "100%", height: "auto" }} 
      >
        <ZoomableGroup center={[0, 20]} disablePanning>
          <Geographies geography="/build/world-50m.json" disableOptimization={true}>
            {(geographies, projection) =>
              geographies.map((geography, index) =>
                buildGeography(geography, projection, index)
              )
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip html={true} />
    </div>
  );
};
