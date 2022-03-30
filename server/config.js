const { isPlainObject } = require("is-plain-object");

const defaultConfig = {
  allowedDomains: ["(.+)"],
  storageDriver: "sqlite",
  storageOptions: {
    location: ".data/hits.db"
  },
  port: 8080
};

const config = {
  ...defaultConfig,
  ...loadConfig()
};

function loadConfig() {
  try {
    const config = require("../config.json");
    if (isPlainObject(config)) {
      return config;
    }
  } catch (e) {}

  console.log("Invalid or missing config file, using defauts");
  return {};
}

module.exports = config;
