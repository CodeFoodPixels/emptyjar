import { overwrite, getName, getCode } from "country-list";
import { ONE_DAY } from "./constants.js";

overwrite([
  {
    code: "US",
    name: "United States"
  },
  {
    code: "GB",
    name: "United Kingdom"
  }
]);

export const getCountryName = getName;
export const getCountryCode = getCode;

export const stateFromUrlParams = url => {
  const { searchParams } = new URL(url);
  const urlState = {
    queryDates: {},
    filters: {}
  };

  for (let [key, value] of searchParams.entries()) {
    if (key === "to" || key === "from") {
      urlState.queryDates[key] = new Date(value);
    } else {
      urlState.filters[key] = value;
    }
  }

  return urlState;
};

export const dateYMD = date => {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getUTCDate()
    .toString()
    .padStart(2, "0")}`;
};

export const generateInitialState = () => {
  const urlParams = stateFromUrlParams(window.location.href);

  const fromDate = new Date(Date.now() - ONE_DAY * 6);
  const from = new Date();
  from.setUTCFullYear(fromDate.getFullYear());
  from.setUTCMonth(fromDate.getMonth());
  from.setUTCDate(fromDate.getDate());
  from.setUTCHours(0, 0, 0, 0);

  const toDate = new Date();
  const to = new Date();
  to.setUTCFullYear(toDate.getFullYear());
  to.setUTCMonth(toDate.getMonth());
  to.setUTCDate(toDate.getDate());
  to.setUTCHours(23, 59, 59, 999);

  return {
    queryDates: {
      from,
      to,
      ...urlParams.queryDates
    },
    filters: { ...urlParams.filters },
    loading: false,
    data: []
  };
};
