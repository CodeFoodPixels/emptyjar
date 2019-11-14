const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, ".data", "hits.db");
const dbFileExists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  if (!dbFileExists) {
    db.run(
      "CREATE TABLE hits (url TEXT, browser TEXT, operating_system TEXT, device_type TEXT, country TEXT, page_hit_unique INT, site_hit_unique INT, timestamp INT)"
    );
    db.run("CREATE TABLE page_hit_signatures (signature TEXT PRIMARY KEY)");
    db.run("CREATE TABLE site_hit_signatures (signature TEXT PRIMARY KEY)");
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
      data.pageHitUnique ? 1 : 0,
      data.siteHitUnique ? 1 : 0,
      Math.floor(Date.now() / 1000)
    ];

    db.serialize(() => {
      db.run(
        "INSERT INTO hits (url, browser, operating_system, device_type, country, page_hit_unique, site_hit_unique, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        hitData
      );
    });
  },

  logPageHitSignature(signature) {
    db.serialize(() => {
      db.run(
        "INSERT INTO page_hit_signatures (signature) VALUES (?)",
        signature
      );
    });
  },

  logSiteHitSignature(signature) {
    db.serialize(() => {
      db.run(
        "INSERT INTO site_hit_signatures (signature) VALUES (?)",
        signature
      );
    });
  },

  pageHitUnique(signature) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * from page_hit_signatures WHERE signature = ?",
        [signature],
        function(err, rows) {
          if (err) {
            return reject(err);
          }
          resolve(rows.length > 0 ? false : true);
        }
      );
    });
  },

  siteHitUnique(signature) {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT * from site_hit_signatures WHERE signature = ?",
        [signature],
        function(err, rows) {
          if (err) {
            return reject(err);
          }
          resolve(rows.length > 0 ? false : true);
        }
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

    if (typeof params.page_hit_unique !== "undefined") {
      queryParts.push("page_hit_unique = ?");
      queryValues.push(params.page_hit_unique ? 1 : 0);
    }

    if (typeof params.site_hit_unique !== "undefined") {
      queryParts.push("site_hit_unique = ?");
      queryValues.push(params.site_hit_unique ? 1 : 0);
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

        const result = rows.map(hit => {
          hit.page_hit_unique = hit.page_hit_unique === 1 ? true : false;
          hit.site_hit_unique = hit.site_hit_unique === 1 ? true : false;

          return hit;
        });

        resolve(result);
      });
    });
  }
};
