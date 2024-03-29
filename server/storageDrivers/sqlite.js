const fs = require("fs");
const path = require("path");
const { replaceAll } = require("../utilities");
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

  init() {
    return new Promise((resolve, reject) => {
      const dbFile = path.join(__dirname, "..", "..", this.options.location);
      const dbFileExists = fs.existsSync(dbFile);

      this.db = new sqlite3.Database(dbFile);

      if (!dbFileExists) {
        this.db.serialize(() => {
          this.db.run(
            "CREATE TABLE hits (url TEXT, referrer TEXT, browser TEXT, operating_system TEXT, device_type TEXT, country TEXT, page_hit_unique INT, site_hit_unique INT, timestamp INT)",
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

          if (data[key] instanceof Date) {
            data[key] = Math.floor(data[key].getTime() / 1000);
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

  find(table, params = []) {
    let query = `SELECT * from ${table}`;
    const paramValues = [];

    if (params.length > 0) {
      const queryParams = [];

      const processParam = param => {
        let operator = "LIKE";

        if (param.operator) {
          operator = param.operator;
        }

        if (param.strictEquality) {
          operator = "=";
        }

        if (param.wildcardMatch) {
          param.value = replaceAll(param.value, param.wildcardCharacter, "%");
        }

        if (typeof param.value === "boolean") {
          param.value = param.value ? 1 : 0;
        }

        if (param.value instanceof Date) {
          param.value = Math.floor(param.value.getTime() / 1000);
        }

        paramValues.push(param.value);

        return `${param.key} ${operator} ?`;
      };

      params.forEach(param => {
        if (Array.isArray(param.value)) {
          const subParams = [];
          param.value.forEach(paramItem => {
            subParams.push(processParam({ ...param, value: paramItem }));
          });

          return queryParams.push(`(${subParams.join(" OR ")})`);
        }

        queryParams.push(processParam(param));
      });

      query = `${query} WHERE ${queryParams.join(" AND ")}`;
    }

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
