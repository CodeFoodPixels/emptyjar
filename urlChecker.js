const url = require("url");
let domains = ["(.+)"];
try {
  const config = require("./config.json");
  if (config.allowedDomains.length > 0) {
    domains = config.allowedDomains;
  }
} catch (e) {
  console.log("Config file not found, using default domains");
}

const matcher = new RegExp(
  `^${domains.length > 1 ? `(${domains.join("|")})` : domains[0]}$`
);

module.exports = hitUrl => {
  if (hitUrl.match(/^\[FALLBACK\] (.+)$/)) {
    return true;
  }

  const parsedUrl = url.parse(hitUrl);

  return matcher.test(parsedUrl.hostname);
};
