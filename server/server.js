const http = require("http");
const { removeTrailingSlashes } = require("./utilities");
const routes = require("./routes");
const request = require("./request");
const response = require("./response");

const server = http.createServer({
  IncomingMessage: request,
  ServerResponse: response
});

server.on("request", (req, res) => {
  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );
  res.setHeader("Expires", "-1");
  res.setHeader("Pragma", "no-cache");

  const pathName =
    req.requestUrl.pathname.length > 1
      ? removeTrailingSlashes(req.requestUrl.pathname)
      : req.requestUrl.pathname;

  req.on("data", chunk => {
    req.body += chunk.toString(); // convert Buffer to string
  });
  req.on("end", async () => {
    if (routes[req.method] && routes[req.method][pathName]) {
      await routes[req.method][pathName](req, res);
    } else if (routes[req.method] && routes[req.method]["*"]) {
      await routes[req.method]["*"](req, res);
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  });
});

module.exports = server;
