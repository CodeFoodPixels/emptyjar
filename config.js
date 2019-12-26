const defaultConfig = {
  allowedDomains: ["(.+)"],
  storageDriver: "sqlite",
  storageOptions: {
    location: ".data/hits.db"
  }
};

const config = {
  ...defaultConfig,
  ...loadConfig()
};

function loadConfig() {
  try {
    const config = require("./config.json");
    if (
      (typeof config === "object" || typeof config === "function") &&
      config !== null
    ) {
      return config;
    }
  } catch (e) {}

  console.log("Invalid or missing config file, using defauts");
  return {};
}

module.exports = config;
