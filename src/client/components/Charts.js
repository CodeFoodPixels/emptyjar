import React from "react";
import TimeSeries from "./Charts/TimeSeries";

export default () => {
  return (
    <section>
      <TimeSeries title="Hits by browser" groupBy="browser" />
      <TimeSeries title="Hits by operating system" groupBy="operating_system" />
      <TimeSeries title="Hits by device type" groupBy="device_type" />
      <TimeSeries title="Hits by URL" groupBy="url" />
      <TimeSeries title="Total hits" />
    </section>
  );
};
