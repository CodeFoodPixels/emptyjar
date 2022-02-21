const data = require("../data.js");

function removeTrailingSlashes(str) {
  if (typeof str !== "string") {
    return str;
  }

  let i = str.length;
  while (str[--i] === "/");
  return str.slice(0, i + 1);
}

function processReferrer(url) {
  if (url) {
    try {
      const referrer = new URL(url);

      if (referrer.origin && referrer.origin !== "null") {
        return referrer.host;
      } else if (referrer.protocol === "android-app:") {
        return referrer.href;
      } else {
        return "";
      }
    } catch (e) {
      return "";
    }
  } else {
    return "";
  }
}

setTimeout(() => {
  data.getHits().then(hits => {
    hits.forEach(row => {
      const fixedURL = removeTrailingSlashes(row.url);
      const fixedReferrer = processReferrer(row.referrer);
      if (fixedURL !== row.url || fixedReferrer !== row.referrer) {
        data.storage.db.serialize(() => {
          data.storage.db.run(
            `UPDATE hits SET url = "${fixedURL}", referrer = "${fixedReferrer}" WHERE url = "${
              row.url
            }" AND referrer = "${row.referrer}" AND browser = "${
              row.browser
            }" AND operating_system = "${
              row.operating_system
            }" AND device_type = "${row.device_type}" AND country = "${
              row.country
            }" AND page_hit_unique = "${
              row.page_hit_unique ? 1 : 0
            }" AND site_hit_unique = "${
              row.site_hit_unique ? 1 : 0
            }" AND timestamp = "${Math.floor(
              new Date(row.timestamp).getTime() / 1000
            )}";`
          );
        });
      }
    });
  });
}, 1000);
