const data = require("../data.js");
const path = require("path");
const { beacon, ping } = require("./capture.js");
const { hits, teapot } = require("./api.js");

function staticFile(req, res) {
  const dir = req.requestUrl.pathname.match(/^\/build/) ? "build" : "public";

  const pathName = path.join(
    "..",
    dir,
    req.requestUrl.pathname.replace(/^\/build/, "")
  );

  res.sendFile(pathName);
}

module.exports = {
  GET: {
    "/ping": ping,
    "/test": (req, res) => res.end('<script src="/ping.js"></script>'),
    "/beacon": beacon,
    "/api/hits": hits,
    "/api/teapot": teapot,
    "/": (req, res) => res.sendFile(path.join("..", "public", "index.html")),
    "*": staticFile
  },
  POST: {
    "/beacon": beacon,
    "*": (req, res) => {
      res.statusCode = 404;
      res.end("Not found");
    }
  }
};
