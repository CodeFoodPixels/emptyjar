const express = require("express");
const path = require("path");
const uaParser = require("ua-parser-js");
const geoip = require("geoip-lite");
const data = require("./data.js");

const app = express();

app.use("/build", express.static(path.join(__dirname, "..", "..", "build")));

app.enable("trust proxy");

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

app.get("/ping.png", nocache, (req, res) => {
  res.sendFile(path.join(__dirname, "ping.png"));
  const url = req.get("Referrer") || req.query.fallback;
  if (url) {
    const userAgent = uaParser(req.get("User-Agent"));

    const device_type = userAgent.device.type || "Unknown";

    const geo = geoip.lookup(req.ip);

    let country = "Unknown";

    if (geo && geo.country) {
      country = geo.country;
    }

    data.logHit({
      url,
      browser: userAgent.browser.name,
      browser_version: userAgent.browser.version,
      operating_system: userAgent.os.name,
      operating_system_version: userAgent.os.version,
      device_type,
      country
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

  if (req.query.operating_system_version) {
    if (!req.query.operating_system) {
      res.status(500);
      return res.json({
        message:
          "operating_system must be defined when searching for operating_system_version"
      });
    }

    params.operating_system_version = req.query.operating_system_version;
  }

  if (req.query.browser) {
    params.browser = req.query.browser;
  }

  if (req.query.browser_version) {
    if (!req.query.browser) {
      res.status(500);
      return res.json({
        message: "browser must be defined when searching for browser_version"
      });
    }

    params.browser_version = req.query.browser_version;
  }

  if (req.query.device_type) {
    params.device_type = req.query.device_type;
  }

  if (req.query.country) {
    params.country = req.query.country;
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

app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});
