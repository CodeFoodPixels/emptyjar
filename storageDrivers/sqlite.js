const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const typeConversions = {
  page_hit_unique: value => (value === 1 ? true : false),
  site_hit_unique: value => (value === 1 ? true : false),
  timestamp: value => new Date(value * 1000).toISOString()
};

module.exports = class sqlite {
  constructor(options) {
    this.options = options;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const dbFile = path.join(__dirname, "..", this.options.location);
      const dbFileExists = fs.existsSync(dbFile);

      this.db = new sqlite3.Database(dbFile);

      if (!dbFileExists) {
        this.db.serialize(() => {
          this.db.run(
            "CREATE TABLE hits (url TEXT, browser TEXT, browser_version TEXT, operating_system TEXT, operating_system_version TEXT, device_type TEXT, country TEXT, page_hit_unique INT, site_hit_unique INT, timestamp INT)",
            () => {
              this.db.run(
                "CREATE TABLE page_hit_signatures (signature TEXT PRIMARY KEY)",
                () => {
                  this.db.run(
                    "CREATE TABLE site_hit_signatures (signature TEXT PRIMARY KEY)",
                    () => {
                      resolve();
                    }
                  );
                }
              );
            }
          );
        });
      } else {
        resolve();
      }
    });
  }

  insertOne(table, data) {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        const columns = Object.keys(data).join(", ");
        const valuePlaceholders = Object.keys(data)
          .map(val => `$${val}`)
          .join(", ");

        const keyedData = {};

        Object.keys(data).forEach(key => {
          if (typeof data[key] === "boolean") {
            data[key] = data[key] ? 1 : 0;
          }

          keyedData[`$${key}`] = data[key];
        });

        this.db.run(
          `INSERT INTO ${table} (${columns}) VALUES (${valuePlaceholders})`,
          keyedData,
          err => {
            resolve();
          }
        );
      });
    });
  }

  find(table, params) {
    let query = `SELECT * from ${table}`;

    if (params.length > 0) {
      const queryParams = [];

      params.forEach(param => {
        let operator = "LIKE";

        if (param.operator) {
          operator = param.operator;
        }

        if (param.strictEquality) {
          operator = "=";
        }

        if (typeof param.value === "boolean") {
          param.value = param.value ? 1 : 0;
        }

        queryParams.push(`${param.key} ${operator} ?`);
      });

      query = `${query} WHERE ${queryParams.join(" AND ")}`;
    }

    const paramValues = params.map(param => param.value);

    return new Promise((resolve, reject) => {
      this.db.all(query, paramValues, function(err, rows) {
        if (err) {
          return reject(err);
        }

        const result = rows.map(row => {
          Object.keys(row).forEach(key => {
            if (typeConversions[key]) {
              row[key] = typeConversions[key](row[key]);
            }
          });

          return row;
        });

        resolve(result);
      });
    });
  }
};
