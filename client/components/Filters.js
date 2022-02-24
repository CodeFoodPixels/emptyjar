import React, { useContext } from "react";
import { CLEAR_FILTERS, REMOVE_FILTER } from "../constants";
import { StateContext } from "../context";

const displayNames = {
  url: "URL",
  referrer: "Referrer",
  device_type: "Device type",
  operating_system: "Operating system",
  browser: "Browser",
  country: "Country"
};

const Filters = () => {
  const {
    state: { filters },
    dispatch
  } = useContext(StateContext);

  const removeFilter = key => () =>
    dispatch({
      type: REMOVE_FILTER,
      key
    });

  const clearFilters = key => () =>
    dispatch({
      type: CLEAR_FILTERS
    });

  const filterElements = Object.keys(filters)
    .filter(key => filters[key])
    .map(key => (
      <button
        className="filters__card"
        type="button"
        onClick={removeFilter(key)}
        key={key}
      >
        <span className="filters__name">{displayNames[key]}</span> is{" "}
        <span className="filters__value">{filters[key]}</span>
        <span className="filters__remove" aria-hidden="true">
          ×
        </span>
      </button>
    ));

  return filterElements.length > 0 ? (
    <div className="filters">
      <div className="filters__content">
        <h2 className="charts__title">Filters</h2>
        <div className="filters__filters">{filterElements}</div>
        <button type="button" onClick={clearFilters()} key={"clear"}>
          Clear Filters
        </button>
      </div>
    </div>
  ) : null;
};

Filters.displayName = "Filters";

export default Filters;
