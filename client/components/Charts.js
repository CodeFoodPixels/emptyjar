import React from "react";
import { connect } from "react-redux";
import Bar from "./Charts/Bar";
import Table from "./Charts/Table";

const Charts = ({
  views,
  uniques,
  urls,
  browsers,
  operatingSystems,
  devices,
  totalHits,
  totalUniques,
  countries
}) => {
  const barData = [];

  if (views && views.length > 0) {
    barData.push({ name: "Views", values: views });
  }

  if (uniques && uniques.length > 0) {
    barData.push({ name: "Uniques", values: uniques });
  }

  return (
    <>
      <div className="charts__row">
        <Bar data={barData} title="Total hits" maxWidth={970} />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by URL"
          total={totalHits}
          columnName="URL"
          data={urls}
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by device type"
          total={totalUniques}
          limit={5}
          columnName="Device Type"
          data={devices}
          showPercentage
        />
        <Table
          title="Hits by operating system"
          total={totalUniques}
          limit={5}
          columnName="Operating System"
          data={operatingSystems}
          showPercentage
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by browser"
          total={totalUniques}
          limit={5}
          columnName="Browser"
          data={browsers}
          showPercentage
        />
        <Table
          title="Hits by country"
          total={totalUniques}
          limit={5}
          columnName="Country"
          data={countries}
          showPercentage
        />
      </div>
    </>
  );
};

Charts.displayName = "Charts";

export default connect(({ data }) => ({
  views: data.views,
  uniques: data.uniques,
  urls: data.urls,
  browsers: data.browsers,
  operatingSystems: data.operatingSystems,
  devices: data.devices,
  totalHits: data.totalHits,
  totalUniques: data.totalUniques,
  countries: data.countries
}))(Charts);
