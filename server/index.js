const http = require("http");
const path = require("path");
const fs = require("fs");

const config = require("./config");
const { removeTrailingSlashes } = require("./helpers.js");
const routes = require("./routes");

const port = process.env.PORT || config.port;

const server = http.createServer();

server.on("request", (req, res) => {
  req.requestUrl = new URL(getRequestURL(req));

  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Expires", "-1");
  res.setHeader("Pragma", "no-cache");
  res.sendFile = sendFile;
  res.sendJSON = sendJSON;

  const pathName =
    req.requestUrl.pathname.length > 1
      ? removeTrailingSlashes(req.requestUrl.pathname)
      : req.requestUrl.pathname;

  if (routes[req.method] && routes[req.method][pathName]) {
    routes[req.method][pathName](req, res);
  } else if (routes[req.method] && routes[req.method]["*"]) {
    routes[req.method]["*"](req, res);
  } else {
    res.statusCode = 404;
    res.end("Not found");
  }
});

function sendFile(filePath) {
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
        this.writeHead(404, { "Content-Type": "text/html" });
        return this.end(`Cannot GET ${filePath}`, "utf-8");
      }

      this.writeHead(500, { "Content-Type": "text/html" });
      console.log(error);
      return this.end("Server error", "utf-8");
    }

    this.writeHead(200, { "Content-Type": contentType });
    this.end(content, "utf-8");
  });
}

function sendJSON(data) {
  this.setHeader("Content-Type", "application/json");
  if (typeof data === "object") {
    this.end(JSON.stringify(data));
  } else {
    this.end(data);
  }
}

function getRequestURL(req) {
  var secure =
    req.connection.encrypted || req.headers["x-forwarded-proto"] === "https";
  return `http${secure ? "s" : ""}://${req.headers.host}${req.url}`;
}

server.listen(port, () => {
  console.log(`Emptyjar is listening on port ${port}`);
});
