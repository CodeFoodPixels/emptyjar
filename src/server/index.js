const express = require("express");
const path = require("path");
const url = require("url");
const crypto = require("crypto");
const uaParser = require("ua-parser-js");
const geoip = require("geoip-lite");
const data = require("./data.js");
const urlChecker = require("./urlChecker.js");

const port = process.env.PORT || 8080;

const app = express();

app.use("/build", express.static(path.join(__dirname, "..", "..", "build")));

app.enable("trust proxy");

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

app.get("/ping.png", nocache, async (req, res) => {
  res.sendFile(path.join(__dirname, "ping.png"));

  const referrer = req.get("Referrer");
  const requestURL = referrer
    ? referrer
    : req.query.fallback
    ? `[FALLBACK] ${req.query.fallback}`
    : undefined;

  if (requestURL && urlChecker(requestURL)) {
    const userAgentString = req.get("User-Agent");
    const userAgent = uaParser(userAgentString);

    const device_type = userAgent.device.type || "Unknown";

    const geo = geoip.lookup(req.ip);

    let country = "Unknown";

    if (geo && geo.country) {
      country = geo.country;
    }

    const parsedURL = url.parse(requestURL);
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = (today.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = today
      .getUTCDate()
      .toString()
      .padStart(2, "0");
    const pageHitData = `${year}${month}${day}${parsedURL.host}/${parsedURL.pathname}${req.ip}${userAgentString}`;
    const siteHitData = `${year}${month}${day}${parsedURL.host}${req.ip}${userAgentString}`;
    const pageHitSignature = crypto
      .createHash("sha256")
      .update(pageHitData)
      .digest("hex");
    const siteHitSignature = crypto
      .createHash("sha256")
      .update(siteHitData)
      .digest("hex");

    const pageHitUnique = await data.pageHitUnique(pageHitSignature);

    if (pageHitUnique) {
      data.logPageHitSignature(pageHitSignature);
    }

    const siteHitUnique = await data.siteHitUnique(siteHitSignature);

    if (siteHitUnique) {
      data.logSiteHitSignature(siteHitSignature);
    }

    const browser =
      `${userAgent.browser.name || ""} ${userAgent.browser.version ||
        ""}`.trim() || "Unknown";
    const operating_system =
      `${userAgent.os.name || ""} ${userAgent.os.version || ""}`.trim() ||
      "Unknown";

    data.logHit({
      url: requestURL,
      browser,
      operating_system,
      device_type,
      country,
      pageHitUnique,
      siteHitUnique
    });
  }
});

app.get("/api/hits", nocache, (req, res) => {
  const params = {};

  if (req.query.url) {
    params.url = req.query.url;
  }

  if (req.query.operating_system) {
    params.operating_system = req.query.operating_system;
  }

  if (req.query.browser) {
    params.browser = req.query.browser;
  }

  if (req.query.device_type) {
    params.device_type = req.query.device_type;
  }

  if (req.query.country) {
    params.country = req.query.country;
  }

  if (req.query.page_hit_unique) {
    params.page_hit_unique = req.query.page_hit_unique === "true" ? true : false;
  }

  if (req.query.site_hit_unique) {
    params.site_hit_unique = req.query.site_hit_unique === "true" ? true : false;
  }

  if (req.query.time_from) {
    params.time_from = req.query.time_from;
  }

  if (req.query.time_to) {
    params.time_to = req.query.time_to;
  }

  if (req.query.country) {
    params.country = req.query.country;
  }

  data.getHits(params).then(data => {
    if (data.length === 0) {
      res.status(404);
    }
    res.json(data);
  });
});

app.get("/api/teapot", (req, res) => {
  res.status(418);
  res.json({ message: "I'm a little teapot..." });
});

app.get("/", nocache, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ping", nocache, (req, res) => {
  res.end('<img src="/ping.png">');
});

app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
