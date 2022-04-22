import React, { useState, useEffect } from "react";
import Loader from "../Loader";

const Table = ({
  columnName,
  total,
  data,
  title,
  limit = 5,
  showPercentage = false,
  filter,
  linkContents = false,
  loading = false
}) => {
  const [paginationData, setPaginationData] = useState({
    start: 0
  });

  useEffect(() => {
    setPaginationData({ start: 0 });
  }, [data]);

  function buildRow(key, rowIndex) {
    const dataKeys = Object.keys(data[key]);
    const percentage = (data[key][dataKeys[0]] / total) * 100;

    const columns = dataKeys.map(dataKey => {
      return (
        <td
          className="charts__table-cell"
          key={dataKey}
          data-testid={`charts__table-row-${rowIndex}--column`}
        >
          {data[key][dataKey]}
        </td>
      );
    });

    return (
      <tr
        key={key}
        className="charts__table-row"
        style={{ "--charts__table-row-bar-width": `${percentage}%` }}
        data-testid={`charts__table-row`}
      >
        <td
          className="charts__table-cell"
          onClick={filter && filter(key)}
          data-testid={`charts__table-row-${rowIndex}--column`}
        >
          {key}{" "}
          {linkContents ? (
            <a
              href={key}
              target="_blank"
              rel="external noopener noreferrer"
              data-testid={`charts__table-row-${rowIndex}--link`}
              onClick={e => e.stopPropagation()}
            >
              [Open in new tab]
            </a>
          ) : null}
        </td>
        {columns}
        {showPercentage ? (
          <td
            className="charts__table-cell"
            data-testid={`charts__table-row-${rowIndex}--column`}
          >
            {percentage.toFixed(2)}%
          </td>
        ) : null}
      </tr>
    );
  }

  function buildRows() {
    const start = paginationData.start;
    const end = paginationData.start + limit;

    const rows = data
      ? Object.keys(data)
          .sort((a, b) => {
            const key = Object.keys(data[a])[0];
            return data[b][key] - data[a][key];
          })
          .slice(start, end)
          .map((key, index) => {
            return buildRow(key, index);
          })
      : [];

    if (rows.length < limit) {
      const emptyRows = limit - rows.length;
      for (let i = 0; i < emptyRows; i++) {
        rows.push(
          <tr
            key={i}
            className="charts__table-row"
            style={{ "--charts__table-row-bar-width": `0%` }}
            data-testid={`charts__table-row--empty`}
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

    return Object.keys(data[firstKey]).map((key, index) => {
      return (
        <th
          className="charts__table-header"
          data-testid={`charts__table-header--${index}`}
          key={key}
        >
          {key}
        </th>
      );
    });
  }

  return (
    <div className="charts__chart">
      <h2 className="charts__title" data-testid="charts__title">
        {title}
      </h2>
      <div
        className="charts__table-wrapper"
        style={{ "--charts__table-row-count": `${limit}` }}
      >
        {loading ? (
          <Loader />
        ) : (
          <table className="charts__table">
            <thead>
              <tr data-testid={`charts__table-header`}>
                <th
                  className="charts__table-header charts__table-header--key"
                  data-testid={`charts__table-header--key`}
                >
                  {columnName}
                </th>
                {buildHeaderColumns()}
                {showPercentage ? (
                  <th
                    className="charts__table-header"
                    data-testid={`charts__table-header--percentage`}
                  >
                    %
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>{buildRows()}</tbody>
          </table>
        )}
      </div>
      {!loading && data && Object.keys(data).length >= limit && (
        <div className="charts__pagination">
          <div className="charts__pagination-button charts__pagination-button--prev">
            {paginationData.start > 0 ? (
              <button
                onClick={() => {
                  setPaginationData({
                    start: paginationData.start - limit
                  });
                }}
                data-testid="charts__pagination-button--prev"
              >
                &laquo; Previous
              </button>
            ) : null}
          </div>
          <div className="charts__pagination-button charts__pagination-button--next">
            {paginationData.start + limit < Object.keys(data).length ? (
              <button
                data-testid="charts__pagination-button--next"
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
      )}
    </div>
  );
};

Table.displayName = "Table";

export default Table;
