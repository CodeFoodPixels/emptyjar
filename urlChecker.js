const url = require("url");
const config = require("./config");

const matcher = new RegExp(
  `^${
    config.allowedDomains.length > 1
      ? `(${config.allowedDomains.join("|")})`
      : config.allowedDomains[0]
  }$`
);

module.exports = hitUrl => {
  if (hitUrl.match(/^\[FALLBACK\] (.+)$/)) {
    return true;
  }

  const parsedUrl = url.parse(hitUrl);

  return matcher.test(parsedUrl.hostname);
};
