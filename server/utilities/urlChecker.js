const config = require("../config");

module.exports = hitUrl => {
  const matcher = new RegExp(
    `^${
      config.allowedDomains.length > 1
        ? `(${config.allowedDomains.join("|")})`
        : config.allowedDomains[0]
    }$`
  );

  const parsedUrl = new URL(hitUrl);

  return matcher.test(parsedUrl.hostname);
};
