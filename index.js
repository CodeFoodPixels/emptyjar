const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const bowser = require("bowser");
const geoip = require("geoip-country");
const data = require("./data.js");
const urlChecker = require("./urlChecker.js");

const port = process.env.PORT || 8080;

const server = http.createServer();

server.on("request", (req, res) => {
  const reqUrl = new URL(getRequestURL(req));

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

  if (req.method === "GET") {
    req.query = reqUrl.searchParams;

    switch (pathName) {
      case "/ping":
        ping(req, res);
        break;
      case "/test":
        res.end('<script src="/ping.js"></script>');
        break;
      case "/beacon":
        beacon(req, res);
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
  } else if (req.method === "POST") {
    switch (pathName) {
      case "/beacon":
        beacon(req, res);
        break;
      default:
        res.statusCode = 404;
        res.end("Not found");
        break;
    }
  }
});

function ping(req, res) {
  sendFile(res, path.join("public", "img", "ping.png"));

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").shift() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const data =
    JSON.parse(
      decodeURIComponent(new URL(getRequestURL(req)).searchParams.get("data"))
    ) || {};

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
    const pageHitData = `${year}${month}${day}${parsedURL.host}/${parsedURL.pathname}${hit.ip}${hit.ua}`;
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
      browser,
      operating_system,
      device_type,
      country,
      page_hit_unique,
      site_hit_unique
    });
  }
}

function hits(req, res) {
  res.statusCode = 200;

  const params = {};

  if (req.query.get("url")) {
    params.url = req.query.get("url");
  }

  if (req.query.get("operating_system")) {
    params.operating_system = req.query.get("operating_system");
  }

  if (req.query.get("browser")) {
    params.browser = req.query.get("browser");
  }

  if (req.query.get("device_type")) {
    params.device_type = req.query.get("device_type");
  }

  if (req.query.get("country")) {
    params.country = req.query.get("country");
  }

  if (req.query.get("page_hit_unique")) {
    params.page_hit_unique =
      req.query.get("page_hit_unique") === "true" ? true : false;
  }

  if (req.query.get("site_hit_unique")) {
    params.site_hit_unique =
      req.query.get("site_hit_unique") === "true" ? true : false;
  }

  if (req.query.get("from")) {
    params.from = req.query.get("from");
  }

  if (req.query.get("to")) {
    params.to = req.query.get("to");
  }

  if (req.query.get("country")) {
    params.country = req.query.get("country");
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

function getRequestURL(req) {
  var secure =
    req.connection.encrypted || req.headers["x-forwarded-proto"] === "https";
  return "http" + (secure ? "s" : "") + "://" + req.headers.host + req.url;
}

server.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
