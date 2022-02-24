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
      filters,
      loading
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

  const barDateFilter = date => {
    const newDates = {
      to: new Date(date),
      from: new Date(date)
    };

    newDates.from.setUTCHours(0, 0, 0, 0);
    newDates.to.setUTCHours(23, 59, 59, 999);
    dispatch({
      type: "UPDATE_QUERYDATES",
      queryDates: newDates
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
        <Bar
          data={barData}
          title="Total hits"
          filter={barDateFilter}
          loading={loading}
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by URL"
          total={totalHits}
          limit={10}
          columnName="URL"
          data={urls}
          filter={tableFilter("url")}
          linkContents
          loading={loading}
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by Referrer"
          total={totalReferredHits}
          limit={10}
          columnName="Referrer URL"
          data={referrers}
          filter={tableFilter("referrer")}
          loading={loading}
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by device type"
          total={totalUniques}
          columnName="Device Type"
          data={devices}
          showPercentage
          filter={tableFilter("device_type")}
          loading={loading}
        />
        <Table
          title="Hits by operating system"
          total={totalUniques}
          columnName="Operating System"
          data={operatingSystems}
          showPercentage
          filter={tableFilter("operating_system")}
          loading={loading}
        />
      </div>
      <div className="charts__row">
        <Table
          title="Hits by browser"
          total={totalUniques}
          columnName="Browser"
          data={browsers}
          showPercentage
          filter={tableFilter("browser")}
          loading={loading}
        />
        <Table
          title="Hits by country"
          total={totalUniques}
          columnName="Country"
          data={countries}
          showPercentage
          filter={tableFilter("country")}
          loading={loading}
        />
      </div>
    </>
  );
};

Charts.displayName = "Charts";

export default Charts;
