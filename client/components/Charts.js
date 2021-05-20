import React, { useContext } from "react";
import Bar from "./Charts/Bar";
import Table from "./Charts/Table";
import { StateContext } from "../context";

const Charts = ({}) => {
  const {
    state: {
      data: {
        views,
        uniques,
        urls,
        referrers,
        browsers,
        operatingSystems,
        devices,
        totalHits,
        totalUniques,
        countries
      }
    },
    dispatch
  } = useContext(StateContext);
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
          title="Hits by Referrer"
          total={totalHits}
          columnName="Referrer URL"
          data={referrers}
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

export default Charts;
