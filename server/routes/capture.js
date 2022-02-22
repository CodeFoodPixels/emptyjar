const crypto = require("crypto");
const path = require("path");
const bowser = require("bowser");
const geoip = require("geoip-country");
const urlChecker = require("../urlChecker.js");
const { removeTrailingSlashes } = require("../helpers.js");
const data = require("../data.js");

function getIP(req) {
  return (
    (req.headers["x-forwarded-for"] || "").split(",").shift() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
}

function ping(req, res) {
  sendFile(res, path.join("..", "public", "img", "ping.png"));

  try {
    const data = JSON.parse(
      decodeURIComponent(req.requestUrl.searchParams.get("data"))
    );

    data.ip = getIP(getIP);
    data.ua = req.headers["user-agent"];

    processHit(data);
  } catch (e) {}
}

function beacon(req, res) {
  res.end();

  let body = "";
  req.on("data", chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on("end", () => {
    try {
      const data = JSON.parse(body);

      data.ip = getIP(req);
      data.ua = req.headers["user-agent"];
      processHit(data);
    } catch (e) {}
  });
}

async function processHit(hit) {
  if (hit.url && urlChecker(hit.url)) {
    const hitData = {
      country: "Unknown",
      referrer: ""
    };

    const userAgent = bowser.parse(hit.ua);
    hitData.device_type = userAgent.platform.type || "Unknown";

    hitData.url = removeTrailingSlashes(hit.url);

    if (hit.r) {
      try {
        const referrer = new URL(hit.r);

        if (referrer.origin && referrer.origin !== "null") {
          hitData.referrer = referrer.host;
        } else if (referrer.protocol === "android-app:") {
          hitData.referrer = referrer.href;
        } else {
          hitData.referrer = "";
        }
      } catch (e) {}
    }

    const geo = geoip.lookup(hit.ip);
    if (geo && geo.country) {
      hitData.country = geo.country;
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
    const pageHitSignature = crypto
      .createHash("sha256")
      .update(pageHitData)
      .digest("hex");
    hitData.page_hit_unique = await data.pageHitUnique(pageHitSignature);
    if (hitData.page_hit_unique) {
      data.logPageHitSignature(pageHitSignature);
    }

    const siteHitData = `${year}${month}${day}${parsedURL.host}${hit.ip}${hit.ua}`;
    const siteHitSignature = crypto
      .createHash("sha256")
      .update(siteHitData)
      .digest("hex");
    hitData.site_hit_unique = await data.siteHitUnique(siteHitSignature);
    if (hitData.site_hit_unique) {
      data.logSiteHitSignature(siteHitSignature);
    }

    hitData.browser =
      `${userAgent.browser.name || ""} ${userAgent.browser.version ||
        ""}`.trim() || "Unknown";

    const operating_system_version =
      userAgent.os.name.toLowerCase() === "windows"
        ? userAgent.os.versionName
        : userAgent.os.version;
    hitData.operating_system =
      `${userAgent.os.name || ""} ${operating_system_version || ""}`.trim() ||
      "Unknown";

    data.logHit(hitData);
  }
}

module.exports = {
  ping,
  beacon
};
