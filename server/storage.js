const config = require("./config");

function loadDriver(storageDriver) {
  try {
    return require(`./storageDrivers/${storageDriver.toLowerCase()}`);
  } catch (e) {
    console.error(
      `Storage driver ${storageDriver.toLowerCase()} could not be loaded`
    );
    process.exit();
  }
}

function buildDriver(storageDriver, storageOptions) {
  try {
    return new driver(storageOptions);
  } catch (e) {
    console.error(
      `Storage driver ${storageDriver.toLowerCase()} could not be initialised`
    );
    process.exit();
  }
}

const driver = loadDriver(config.storageDriver);
const driverInstance = buildDriver(config.storageDriver, config.storageOptions);

module.exports = driverInstance;
