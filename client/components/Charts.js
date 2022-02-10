import React, { useContext } from "react";
import Bar from "./Charts/Bar";
import Table from "./Charts/Table";
import { StateContext } from "../context";

const Charts = ({}) => {
  const {
    state: {
      data: {
        dates,
        views,
        uniques,
        urls,
        referrers,
        browsers,
        operatingSystems,
        devices,
        totalHits,
        totalReferredHits,
        totalUniques,
        countries
      },
      filters
    },
    dispatch
  } = useContext(StateContext);

  const tableFilter = key => value => () => {
    if (filters[key]) {
      return dispatch({
        type: "REMOVE_FILTER",
        key
      });
    }

    dispatch({
      type: "UPDATE_FILTERS",
      key,
      value
    });
  };

  const barData = {
    labels: dates,
    data: []
  };

  if (views && Object.keys(views).length > 0) {
    barData.data.push({
      name: "Views",
      values: dates.map(date => views[date])
    });
  }

  if (uniques && Object.keys(uniques).length > 0) {
    barData.data.push({
      name: "Uniques",
      values: dates.map(date => uniques[date])
    });
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
          filter={tableFilter("url")}
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by Referrer"
          total={totalReferredHits}
          columnName="Referrer URL"
          data={referrers}
          filter={tableFilter("referrer")}
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
          filter={tableFilter("device_type")}
        />
        <Table
          title="Hits by operating system"
          total={totalUniques}
          limit={5}
          columnName="Operating System"
          data={operatingSystems}
          showPercentage
          filter={tableFilter("operating_system")}
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
          filter={tableFilter("browser")}
        />
        <Table
          title="Hits by country"
          total={totalUniques}
          limit={5}
          columnName="Country"
          data={countries}
          showPercentage
          filter={tableFilter("country")}
        />
      </div>
    </>
  );
};

Charts.displayName = "Charts";

export default Charts;
