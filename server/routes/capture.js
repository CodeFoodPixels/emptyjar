const crypto = require("crypto");
const path = require("path");
const geoip = require("geoip-country");
const { removeTrailingSlashes, uaParser, urlChecker } = require("../utilities");
const data = require("../data.js");

function getIP(req) {
  return (
    (req.headers["x-forwarded-for"] || "").split(",").shift() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress
  );
}

async function ping(req, res) {
  res.sendFile(path.join("..", "public", "img", "ping.png"));

  try {
    const data = JSON.parse(
      decodeURIComponent(req.requestUrl.searchParams.get("data"))
    );

    data.ip = getIP(req);
    data.ua = req.headers["user-agent"];

    await processHit(data);
  } catch (e) {}
}

async function beacon(req, res) {
  res.end();
  try {
    const data = JSON.parse(req.body);

    data.ip = getIP(req);
    data.ua = req.headers["user-agent"];
    await processHit(data);
  } catch (e) {}
}

async function processHit(hit) {
  if (hit.url && urlChecker(hit.url)) {
    const hitData = {
      country: "Unknown",
      referrer: "",
      ...uaParser(hit.ua)
    };

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

    return data.logHit(hitData);
  }
}

module.exports = {
  ping,
  beacon
};
