const data = require("../data.js");
const storage = require("../storage.js");

const urls = [
  "https://lukeb.co.uk/blog/2022/01/17/pixelated-rounded-corners-with-css-clip-path",
  "https://lukeb.co.uk",
  "https://lukeb.co.uk/blog",
  "https://lukeb.co.uk/blog/2021/03/15/no-comment-adding-webmentions-to-my-site",
  "https://lukeb.co.uk/speaking",
  "https://lukeb.co.uk/blog/2020/05/25/do-i-need-bunting-today",
  "https://lukeb.co.uk/blog/2021/05/12/per-aspera-ad-astra",
  "https://lukeb.co.uk/blog/2021/03/03/today-i-was-vaccinated-for-covid",
  "https://lukeb.co.uk/blog/2020/04/09/css-naked-day-2020",
  "https://lukeb.co.uk/blog/2020/02/01/the-viewbuilder-pattern",
  "https://lukeb.co.uk/blog/page/2",
  "https://lukeb.co.uk/blog/2019/11/11/building-the-new-leedsjs-website",
  "https://lukeb.co.uk/blog/2021/02/12/now-with-added-eleventy"
];

const referrers = [
  "https://t.co",
  "https://www.reddit.com",
  "https://out.reddit.com",
  "https://t.co",
  "https://old.reddit.com",
  "https://reddit.com"
];

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

setTimeout(async () => {
  await storage.init();

  for (let i = 0; i < 100; i++) {
    const hits = getRandom(2000);
    const timestamp = new Date(today - 86400000 * i);

    for (let h = 0; h < hits; h++) {
      const browser = browsers[getRandom(browsers.length)];
      const operating_system =
        operatingSystems[getRandom(operatingSystems.length)];
      const device_type = devices[getRandom(devices.length)];
      const country = countries[getRandom(countries.length)];

      await data.logHit({
        url: urls[getRandom(urls.length)],
        referrer: getRandom(2) ? "" : referrers[getRandom(referrers.length)],
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
}, 1000);
