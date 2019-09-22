const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "..", "..", ".data", "hits.db");
const dbFileExists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!dbFileExists) {
    db.run(
      "CREATE TABLE hits (url TEXT, browser TEXT, operating_system TEXT, device_type TEXT, country TEXT, timestamp INT)"
    );
  }
});

module.exports = {
  logHit(data) {
    const hitData = [
      data.url,
      data.browser,
      data.operating_system,
      data.device_type,
      data.country,
      Math.floor(Date.now() / 1000)
    ];

    db.serialize(() => {
      db.run(
        "INSERT INTO hits (url, browser, operating_system, device_type, country, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
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

    if (params.browser) {
      queryParts.push("browser LIKE ?");
      queryValues.push(params.browser);
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
