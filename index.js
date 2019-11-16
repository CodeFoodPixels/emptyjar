const http = require("http");
const path = require("path");
const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const uaParser = require("ua-parser-js");
const geoip = require("geoip-lite");
const data = require("./data.js");
const urlChecker = require("./urlChecker.js");

const port = process.env.PORT || 8080;

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.method === "GET") {
    const reqUrl = url.parse(req.url, true);

    req.query = reqUrl.query;

    res.setHeader(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    res.setHeader("Expires", "-1");
    res.setHeader("Pragma", "no-cache");

    const pathName =
      reqUrl.pathname.length > 1
        ? reqUrl.pathname.replace(/\/$/, "")
        : reqUrl.pathname;

    switch (pathName) {
      case "/ping.png":
        ping(req, res);
        break;
      case "/ping":
        res.end('<img src="/ping.png">');
        break;
      case "/api/hits":
        hits(req, res);
        break;
      case "/api/teapot":
        teapot(req, res);
        break;
      case "/":
        sendFile(res, "index.html");
        break;
      default:
        staticFile(pathName, req, res);
        break;
    }
  }
});

async function ping(req, res) {
  sendFile(res, path.join("public", "img", "ping.png"));

  const referrer = req.headers["referrer"] || req.headers["referer"];
  const requestURL = referrer
    ? referrer
    : req.query.fallback
    ? `[FALLBACK] ${req.query.fallback}`
    : undefined;

  if (requestURL && urlChecker(requestURL)) {
    const userAgentString = req.headers["user-agent"];
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
}

function hits(req, res) {
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
    params.page_hit_unique =
      req.query.page_hit_unique === "true" ? true : false;
  }

  if (req.query.site_hit_unique) {
    params.site_hit_unique =
      req.query.site_hit_unique === "true" ? true : false;
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
    let status = 200;
    if (data.length === 0) {
      status = 404;
    }

    res.statusCode = status;
    sendJSON(res, data);
  });
}

function teapot(req, res) {
  res.statusCode = 418;
  sendJSON(res, { message: "I'm a little teapot..." });
}

function staticFile(pathName, req, res) {
  const dir = pathName.match(/^\/build/) ? "build" : "public";

  pathName = path.join(dir, pathName.replace(/^\/build/, ""));

  sendFile(res, pathName);
}

function sendFile(res, filePath) {
  const realPath = path.join(__dirname, filePath);
  const extname = path.extname(realPath);

  let contentType = "text/html";

  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".png":
      contentType = "image/png";
      break;
  }

  fs.readFile(realPath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end(`Cannot GET ${filePath}`, "utf-8");
      }

      res.writeHead(500, { "Content-Type": "text/html" });
      console.log(error);
      return res.end("Server error", "utf-8");
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf-8");
  });
}

function sendJSON(res, data) {
  res.setHeader("Content-Type", "application/json");
  if (typeof data === "object") {
    res.end(JSON.stringify(data));
  } else {
    res.end(data);
  }
}

server.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
