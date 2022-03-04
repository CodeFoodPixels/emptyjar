const data = require("../data.js");

function hits(req, res) {
  res.statusCode = 200;

  const params = {};

  if (req.requestUrl.searchParams.getAll("url").length > 0) {
    params.url = req.requestUrl.searchParams.getAll("url");
  }

  if (req.requestUrl.searchParams.getAll("referrer").length > 0) {
    params.referrer = req.requestUrl.searchParams.getAll("referrer");
  }

  if (req.requestUrl.searchParams.getAll("operating_system").length > 0) {
    params.operating_system = req.requestUrl.searchParams.getAll(
      "operating_system"
    );
  }

  if (req.requestUrl.searchParams.getAll("browser").length > 0) {
    params.browser = req.requestUrl.searchParams.getAll("browser");
  }

  if (req.requestUrl.searchParams.getAll("device_type").length > 0) {
    params.device_type = req.requestUrl.searchParams.getAll("device_type");
  }

  if (req.requestUrl.searchParams.getAll("country").length > 0) {
    params.country = req.requestUrl.searchParams.getAll("country");
  }

  if (req.requestUrl.searchParams.get("page_hit_unique")) {
    params.page_hit_unique =
      req.requestUrl.searchParams.get("page_hit_unique") === "true";
  }

  if (req.requestUrl.searchParams.get("site_hit_unique")) {
    params.site_hit_unique =
      req.requestUrl.searchParams.get("site_hit_unique") === "true";
  }

  if (req.requestUrl.searchParams.get("from")) {
    params.from = req.requestUrl.searchParams.get("from");
  }

  if (req.requestUrl.searchParams.get("to")) {
    params.to = req.requestUrl.searchParams.get("to");
  }

  return data.getHits(params).then(data => {
    let status = 200;
    if (data.length === 0) {
      status = 404;
    }

    res.statusCode = status;
    res.sendJSON(data);
  });
}

function teapot(req, res) {
  res.statusCode = 418;
  res.sendJSON({ message: "I'm a little teapot..." });
}

module.exports = {
  hits,
  teapot
};
