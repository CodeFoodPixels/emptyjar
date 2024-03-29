const MongoClient = require("mongodb").MongoClient;

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

module.exports = class sqlite {
  constructor(options) {
    this.options = options;
  }

  async init() {
    const auth = {};

    if (this.options.username) {
      auth.username = this.options.username;
    }

    if (this.options.password) {
      auth.password = this.options.password;
    }

    return MongoClient.connect(
      this.options.url,
      Object.keys(auth).length > 0 ? { auth } : undefined
    ).then(client => {
      this.db = client.db(this.options.db);
    });
  }

  insertOne(collection, data) {
    return this.db.collection(collection).insertOne(data);
  }

  find(collection, params = []) {
    const query = {};

    if (params.length > 0) {
      const queryParams = [];

      params.forEach(param => {
        if (param.operator === "<") {
          return queryParams.push({ [param.key]: { $lt: param.value } });
        }

        if (param.operator === "<=") {
          return queryParams.push({ [param.key]: { $lte: param.value } });
        }

        if (param.operator === ">") {
          return queryParams.push({ [param.key]: { $gt: param.value } });
        }

        if (param.operator === ">=") {
          return queryParams.push({ [param.key]: { $gte: param.value } });
        }

        if (Array.isArray(param.value)) {
          if (param.wildcardMatch) {
            param.value = param.value.map(value => {
              return new RegExp(value.replace(param.wildcardCharacter, ".*"));
            });
          }
          return queryParams.push({ [param.key]: { $in: param.value } });
        }

        if (param.wildcardMatch) {
          return queryParams.push({
            [param.key]: {
              $regex: new RegExp(
                param.value.replace(param.wildcardCharacter, ".*")
              )
            }
          });
        }

        if (param.strictEquality) {
          return queryParams.push({ [param.key]: param.value });
        }

        if (typeof param.value === "string") {
          return queryParams.push({
            [param.key]: new RegExp(escapeRegExp(param.value), "i")
          });
        }

        queryParams.push({
          [param.key]: param.value
        });
      });

      query["$and"] = queryParams;
    }

    return this.db
      .collection(collection)
      .find(query)
      .toArray()
      .then(docs => {
        return docs.map(doc => {
          delete doc._id;

          return doc;
        });
      });
  }
};
