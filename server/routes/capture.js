const crypto = require("crypto");
const path = require("path");
const bowser = require("bowser");
const geoip = require("geoip-country");
const urlChecker = require("../urlChecker.js");
const { removeTrailingSlashes } = require("../helpers.js");
const data = require("../data.js");

function ping(req, res) {
  sendFile(res, path.join("..", "public", "img", "ping.png"));

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").shift() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const data =
    JSON.parse(decodeURIComponent(req.requestUrl.searchParams.get("data"))) ||
    {};

  data.ip = ip;
  data.ua = req.headers["user-agent"];

  processHit(data);
}

function beacon(req, res) {
  res.end();

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").shift() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let body = "";
  req.on("data", chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on("end", () => {
    const data = JSON.parse(body);

    data.ip = ip;
    data.ua = req.headers["user-agent"];

    processHit(data);
  });
}

async function processHit(hit) {
  if (hit.url && urlChecker(hit.url)) {
    const userAgent = bowser.parse(hit.ua);

    const device_type = userAgent.platform.type || "Unknown";

    const geo = geoip.lookup(hit.ip);

    let country = "Unknown";

    hit.url = removeTrailingSlashes(hit.url);
    if (hit.r) {
      try {
        const referrer = new URL(hit.r);

        if (referrer.origin && referrer.origin !== "null") {
          hit.r = referrer.host;
        } else if (referrer.protocol === "android-app:") {
          hit.r = referrer.href;
        } else {
          hit.r = "";
        }
      } catch (e) {
        hit.r = "";
      }
    } else {
      hit.r = "";
    }

    if (geo && geo.country) {
      country = geo.country;
    }

    const parsedURL = new URL(hit.url);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = today
      .getUTCDate()
      .toString()
      .padStart(2, "0");
    const pageHitData = `${year}${month}${day}${parsedURL.host}/${parsedURL.pathname}${hit.ip}${hit.ua}${hit.r}`;
    const siteHitData = `${year}${month}${day}${parsedURL.host}${hit.ip}${hit.ua}`;
    const pageHitSignature = crypto
      .createHash("sha256")
      .update(pageHitData)
      .digest("hex");
    const siteHitSignature = crypto
      .createHash("sha256")
      .update(siteHitData)
      .digest("hex");

    const page_hit_unique = await data.pageHitUnique(pageHitSignature);

    if (page_hit_unique) {
      data.logPageHitSignature(pageHitSignature);
    }

    const site_hit_unique = await data.siteHitUnique(siteHitSignature);

    if (site_hit_unique) {
      data.logSiteHitSignature(siteHitSignature);
    }

    const browser =
      `${userAgent.browser.name || ""} ${userAgent.browser.version ||
        ""}`.trim() || "Unknown";

    const operating_system_version =
      userAgent.os.name.toLowerCase() === "windows"
        ? userAgent.os.versionName
        : userAgent.os.version;
    const operating_system =
      `${userAgent.os.name || ""} ${operating_system_version || ""}`.trim() ||
      "Unknown";

    data.logHit({
      url: hit.url,
      referrer: hit.r || "",
      browser,
      operating_system,
      device_type,
      country,
      page_hit_unique,
      site_hit_unique
    });
  }
}

module.exports = {
  ping,
  beacon
};
