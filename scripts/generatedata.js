const data = require("../data.js");

const browsers = [
  "Chrome 97.0.4692.71",
  "Safari 15.1",
  "Chrome 97.0.4692.87",
  "Safari 15.2",
  "Firefox 96.0"
];

const operatingSystems = [
  "Windows 10",
  "macOS 10.15.7",
  "Android 11",
  "Android 12",
  "iOS 15.1"
];

const devices = ["mobile", "desktop", "tablet", "Unknown"];

const countries = ["DE", "CN", "US", "CA", "AU", "GB"];

const today = new Date();

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

for (let i = 0; i < 100; i++) {
  const hits = getRandom(100);
  const timestamp = new Date(today - 86400000 * i);

  for (let h = 0; h < hits; h++) {
    const browser = browsers[getRandom(browsers.length)];
    const operating_system =
      operatingSystems[getRandom(operatingSystems.length)];
    const device_type = devices[getRandom(devices.length)];
    const country = countries[getRandom(countries.length)];

    data.logHit({
      url: "https://lukeb.co.uk",
      referrer: "",
      browser,
      operating_system,
      device_type,
      country,
      page_hit_unique: !!getRandom(5),
      site_hit_unique: !!getRandom(5),
      timestamp
    });

    console.log({
      browser,
      operating_system,
      device_type,
      country,
      timestamp
    });
  }
}
