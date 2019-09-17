const fs = require("fs");
const dbFile = "./.data/hits.db";
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
  logHit(url, browser, operating_system, device_type, country) {
    const hitData = [
      url,
      browser,
      operating_system,
      device_type,
      country,
      Math.floor(Date.now()/1000)
    ];
    
    db.serialize(() => {
      db.run(
        "INSERT INTO hits (url, browser, operating_system, device_type, country, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
        hitData
      );
    });
  }
}