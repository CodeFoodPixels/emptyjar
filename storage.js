const config = require("./config");

function loadDriver() {
  switch (config.storageDriver) {
    case "sqlite":
    default:
      return require("./storageDrivers/sqlite");
  }
}

const driver = loadDriver();
const driverInstance = new driver(config.storageOptions);

module.exports = driverInstance;
