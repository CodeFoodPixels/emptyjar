import { overwrite, getName, getCode } from "country-list";

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

export const throttle = (callback, time) => {
  let timeout;
  let args;

  return function() {
    args = arguments;

    if (!timeout) {
      timeout = setTimeout(() => {
        callback.apply(this, args);
        timeout = undefined;
        args = undefined;
      }, time);
    }
  };
};

export const dateYMD = date => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
};
