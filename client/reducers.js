import { overwrite, getName } from "country-list";

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

export default (state, action) => {
  function dateYMD(date) {
    return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date
      .getUTCDate()
      .toString()
      .padStart(2, "0")}`;
  }

  switch (action.type) {
    case "UPDATE_QUERYDATES":
      action.queryDates.from.setUTCHours(0, 0, 0, 0);
      action.queryDates.to.setUTCHours(23, 59, 59, 999);

      return {
        ...state,
        queryDates: action.queryDates
      };
    case "UPDATE_DATA":
      const oneDay = 86400000;
      const days = Math.round(
        Math.abs(state.queryDates.to - state.queryDates.from) / oneDay
      );
      const dayHits = {};

      for (let i = 0; i < days; i++) {
        dayHits[
          dateYMD(new Date(state.queryDates.from.getTime() + oneDay * i))
        ] = { Views: 0, Uniques: 0 };
      }

      const data = {
        dayHits,
        countries: {},
        devices: {},
        browsers: {},
        operatingSystems: {},
        urls: {},
        totalHits: 0,
        totalPageUniques: 0,
        totalUniques: 0
      };

      action.data.forEach(hit => {
        const dateString = dateYMD(new Date(hit.timestamp));

        let country = getName(hit.country);
        country = country ? country : "Unknown";

        if (!data.countries[country]) {
          data.countries[country] = { Uniques: 0 };
        }

        if (!data.devices[hit.device_type]) {
          data.devices[hit.device_type] = { Uniques: 0 };
        }

        if (!data.browsers[hit.browser]) {
          data.browsers[hit.browser] = { Uniques: 0 };
        }

        if (!data.operatingSystems[hit.operating_system]) {
          data.operatingSystems[hit.operating_system] = { Uniques: 0 };
        }

        if (!data.urls[hit.url]) {
          data.urls[hit.url] = { "Total Views": 0, "Unique Views": 0 };
        }

        data.dayHits[dateString].Views += 1;
        data.urls[hit.url]["Total Views"] += 1;
        data.totalHits += 1;
        if (hit.site_hit_unique) {
          data.dayHits[dateString].Uniques += 1;
          data.countries[country].Uniques += 1;
          data.devices[hit.device_type].Uniques += 1;
          data.browsers[hit.browser].Uniques += 1;
          data.operatingSystems[hit.operating_system].Uniques += 1;
          data.totalUniques += 1;
        }

        if (hit.page_hit_unique) {
          data.urls[hit.url]["Unique Views"] += 1;
          data.totalPageUniques += 1;
        }
      });

      return {
        ...state,
        data
      };
  }
  return state;
};
