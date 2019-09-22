import React from "react";
import TimeSeries from "./Charts/TimeSeries";
import Choropleth from "./Charts/Choropleth";

export default () => {
  return (
    <section className="charts">
      <div className="charts__row">
        <TimeSeries title="Total hits" maxWidth={1000} />
      </div>
      <div className="charts__row">
        <TimeSeries title="Hits by URL" groupBy="url" />
        <TimeSeries title="Hits by browser" groupBy="browser" />
      </div>
      <div className="charts__row">
        <TimeSeries title="Hits by device type" groupBy="device_type" />
        <TimeSeries
          title="Hits by operating system"
          groupBy="operating_system"
        />
      </div>
      <div className="charts__row">
        <Choropleth />
      </div>
    </section>
  );
};
