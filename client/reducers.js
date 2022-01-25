import { overwrite, getName } from "country-list";
import { dateYMD } from "./helpers";

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

function removeTrailingSlashes(str) {
  let i = str.length;
  while (str[--i] === "/");
  return str.slice(0, i + 1);
}

export default (state, action) => {
  switch (action.type) {
    case "UPDATE_QUERYDATES":
      return {
        ...state,
        queryDates: action.queryDates
      };
    case "UPDATE_DATA":
      const oneDay = 86400000;
      const days = Math.round(
        Math.abs(state.queryDates.to - state.queryDates.from) / oneDay
      );
      const views = {};
      const uniques = {};

      for (let i = 0; i < days; i++) {
        const date = dateYMD(
          new Date(state.queryDates.from.getTime() + oneDay * i)
        );

        views[date] = { key: date, value: 0 };
        uniques[date] = { key: date, value: 0 };
      }

      const data = {
        countries: {},
        devices: {},
        browsers: {},
        operatingSystems: {},
        urls: {},
        referrers: {},
        totalHits: 0,
        totalReferredHits: 0,
        totalPageUniques: 0,
        totalUniques: 0
      };

      action.data.forEach(hit => {
        const dateString = dateYMD(new Date(hit.timestamp));
        const url = removeTrailingSlashes(hit.url);
        const referrer = removeTrailingSlashes(hit.referrer);

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

        if (!data.urls[url]) {
          data.urls[url] = { "Total Views": 0, "Unique Views": 0 };
        }

        if (referrer !== "") {
          if (!data.referrers[referrer]) {
            data.referrers[referrer] = {
              "Total Views": 0
            };
          }
          data.referrers[referrer]["Total Views"] += 1;
          data.totalReferredHits += 1;
        }

        views[dateString].value += 1;
        data.urls[url]["Total Views"] += 1;
        data.totalHits += 1;

        if (hit.site_hit_unique) {
          uniques[dateString].value += 1;
          data.countries[country].Uniques += 1;
          data.devices[hit.device_type].Uniques += 1;
          data.browsers[hit.browser].Uniques += 1;
          data.operatingSystems[hit.operating_system].Uniques += 1;
          data.totalUniques += 1;
        }

        if (hit.page_hit_unique) {
          data.urls[url]["Unique Views"] += 1;
          data.totalPageUniques += 1;
        }
      });

      data.views = Object.values(views);
      data.uniques = Object.values(uniques);

      return {
        ...state,
        data
      };
  }
  return state;
};
