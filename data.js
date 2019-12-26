const storage = require("./storage");

storage.init();

module.exports = {
  logHit(data) {
    const hitData = {
      ...data,
      timestamp: Math.floor(Date.now() / 1000)
    };

    return storage.insertOne("hits", hitData);
  },

  logPageHitSignature(signature) {
    return storage.insertOne("page_hit_signatures", {
      signature
    });
  },

  logSiteHitSignature(signature) {
    return storage.insertOne("site_hit_signatures", {
      signature
    });
  },

  pageHitUnique(signature) {
    return storage
      .find("page_hit_signatures", {
        signature: { value: signature }
      })
      .then(rows => {
        return rows.length > 0 ? false : true;
      });
  },

  siteHitUnique(signature) {
    return storage
      .find("site_hit_signatures", {
        signature: { value: signature }
      })
      .then(rows => {
        return rows.length > 0 ? false : true;
      });
  },

  getHits(params) {
    const queryParams = [];

    if (params.url) {
      queryParams.push({
        key: "url",
        value: params.url
      });
    }

    if (params.operating_system) {
      queryParams.push({
        key: "operating_system",
        value: params.operating_system
      });
    }

    if (params.browser) {
      queryParams.push({
        key: "browser",
        value: params.browser
      });
    }

    if (params.device_type) {
      queryParams.push({
        key: "device_type",
        value: params.device_type
      });
    }

    if (params.country) {
      queryParams.push({
        key: "country",
        value: params.country
      });
    }

    if (typeof params.page_hit_unique !== "undefined") {
      queryParams.push({
        key: "page_hit_unique",
        value: params.page_hit_unique,
        strictEquality: true
      });
    }

    if (typeof params.site_hit_unique !== "undefined") {
      queryParams.push({
        key: "site_hit_unique",
        value: params.site_hit_unique,
        strictEquality: true
      });
    }

    if (params.from) {
      const fromDate = new Date(params.from);
      queryParams.push({
        key: "timestamp",
        value: Math.floor(fromDate.getTime() / 1000),
        operator: ">="
      });
    }

    if (params.to) {
      const toDate = new Date(params.to);
      queryParams.push({
        key: "timestamp",
        value: Math.floor(toDate.getTime() / 1000),
        operator: "<="
      });
    }

    return storage.find("hits", queryParams);
  }
};
