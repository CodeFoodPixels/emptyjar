import React, { useState, useEffect } from "react";

const Table = ({
  columnName,
  total,
  data,
  title,
  limit = 10,
  showPercentage = false,
  filter,
  linkContents = false
}) => {
  if (!data) {
    return null;
  }

  const [paginationData, setPaginationData] = useState({
    start: 0
  });

  useEffect(() => {
    setPaginationData({ start: 0 });
  }, [data]);

  function buildRow(key) {
    const dataKeys = Object.keys(data[key]);
    const percentage = Math.ceil((data[key][dataKeys[0]] / total) * 100);

    const columns = dataKeys.map(dataKey => {
      return (
        <td className="charts__table-cell" key={dataKey}>
          {data[key][dataKey]}
        </td>
      );
    });

    return (
      <tr
        key={key}
        className="charts__table-row"
        style={{ "--charts__table-row-bar-width": `${percentage}%` }}
      >
        <td className="charts__table-cell" onClick={filter(key)}>
          {key}{" "}
          {linkContents ? (
            <a
              href={key}
              target="_blank"
              rel="external noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              [Open in new tab]
            </a>
          ) : null}
        </td>
        {columns}
        {showPercentage ? (
          <td className="charts__table-cell">{percentage}%</td>
        ) : null}
      </tr>
    );
  }

  function buildRows() {
    const sortedKeys = Object.keys(data).sort((a, b) => {
      const key = Object.keys(data[a])[0];
      return data[b][key] - data[a][key];
    });

    const start = paginationData.start;
    const end = paginationData.start + limit;

    const currentKeys = sortedKeys.slice(start, end);
    const rows = currentKeys.map(key => {
      return buildRow(key);
    });

    if (currentKeys.length < limit) {
      for (let i = 0; i < limit - currentKeys.length; i++) {
        rows.push(
          <tr
            key={i}
            className="charts__table-row"
            style={{ "--charts__table-row-bar-width": `0%` }}
          >
            <td className="charts__table-cell">&nbsp;</td>
          </tr>
        );
      }
    }

    return rows;
  }

  function buildHeaderColumns() {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    const firstKey = Object.keys(data)[0];

    return Object.keys(data[firstKey]).map(key => {
      return (
        <th className="charts__table-header" key={key}>
          {key}
        </th>
      );
    });
  }

  return (
    <div className="charts__chart">
      <h2 className="charts__title">{title}</h2>
      <table className="charts__table">
        <thead>
          <tr>
            <th className="charts__table-header charts__table-header--key">
              {columnName}
            </th>
            {buildHeaderColumns()}
            {showPercentage ? (
              <th className="charts__table-header">%</th>
            ) : null}
          </tr>
        </thead>
        <tbody>{buildRows()}</tbody>
      </table>
      <div className="charts__pagination">
        <div className="charts__pagination-button charts__pagination-button--prev">
          {paginationData.start > 0 ? (
            <button
              onClick={() => {
                setPaginationData({
                  start: paginationData.start - limit
                });
              }}
            >
              &laquo; Previous
            </button>
          ) : null}
        </div>
        <div className="charts__pagination-button charts__pagination-button--next">
          {paginationData.start + limit < Object.keys(data).length ? (
            <button
              onClick={() => {
                setPaginationData({
                  start: paginationData.start + limit
                });
              }}
            >
              Next &raquo;
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

Table.displayName = "Table";

export default Table;
