const express = require("express");
const path = require("path");
const uaParser = require("ua-parser-js");
const geoip = require('geoip-lite');
const data = require('./data.js');

const app = express();

app.enable('trust proxy');

function nocache(req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
}

app.get("/ping.png", nocache, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ping.png"));
  const url = req.get('Referrer') || req.query.fallback;
  if (url) {
    const userAgent = uaParser(req.get('User-Agent'));
    
    const browser = `${userAgent.browser.name} ${userAgent.browser.version}`;
    const os = `${userAgent.os.name} ${userAgent.os.version}`;
    const deviceType = userAgent.device.type || "Unknown";

    const geo = geoip.lookup(req.ip);

    let country = "Unknown";
    
    if (geo && geo.country) {
      country = geo.country;
    }

    data.logHit(url, browser, os, deviceType, country);
  }
});

app.get("/", nocache, (req, res) => {
  res.end('<img src="/ping.png">')
});

app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + process.env.PORT);
});
