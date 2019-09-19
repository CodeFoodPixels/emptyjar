const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "..", "..", ".data" ,"hits.db");
const dbFileExists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!dbFileExists) {
    db.run(
      "CREATE TABLE hits (url TEXT, browser TEXT, browser_version REAL, operating_system TEXT, operating_system_version REAL, device_type TEXT, country TEXT, timestamp INT)"
    );
  }
});

module.exports = {
  logHit(data) {
    const hitData = [
      data.url,
      data.browser,
      data.browser_version,
      data.operating_system,
      data.operating_system_version,
      data.device_type,
      data.country,
      Math.floor(Date.now() / 1000)
    ];

    db.serialize(() => {
      db.run(
        "INSERT INTO hits (url, browser, browser_version, operating_system, operating_system_version, device_type, country, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        hitData
      );
    });
  },

  getHits(params) {
    const queryParts = [];
    const queryValues = [];

    if (params.url) {
      queryParts.push("url LIKE ?");
      queryValues.push(params.url);
    }

    if (params.operating_system) {
      queryParts.push("operating_system LIKE ?");
      queryValues.push(params.operating_system);
    }

    if (params.operating_system_version) {
      queryParts.push("operating_system_version=?");
      queryValues.push(params.operating_system_version);
    }

    if (params.browser) {
      queryParts.push("browser LIKE ?");
      queryValues.push(params.browser);
    }

    if (params.browser_version) {
      queryParts.push("browser_version=?");
      queryValues.push(params.browser_version);
    }

    if (params.device_type) {
      queryParts.push("device_type LIKE ?");
      queryValues.push(params.device_type);
    }

    if (params.country) {
      queryParts.push("country LIKE ?");
      queryValues.push(params.country);
    }

    if (params.time_from) {
      queryParts.push("timestamp >= ?");
      queryValues.push(params.time_from);
    }

    if (params.time_to) {
      queryParts.push("timestamp <= ?");
      queryValues.push(params.time_to);
    }

    let query = "SELECT * from hits";

    if (queryParts.length > 0) {
      query = `${query} WHERE ${queryParts.join(" AND ")}`;
    }

    return new Promise((resolve, reject) => {
      db.all(query, queryValues, function(err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }
};
