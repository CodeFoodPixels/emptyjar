const storage = require("./storage");

storage.init();

module.exports = {
  storage,
  logHit(data) {
    const hitData = {
      timestamp: new Date(),
      ...data
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
      .find("page_hit_signatures", [
        {
          key: "signature",
          value: signature
        }
      ])
      .then(results => {
        return results.length > 0 ? false : true;
      });
  },

  siteHitUnique(signature) {
    return storage
      .find("site_hit_signatures", [
        {
          key: "signature",
          value: signature
        }
      ])
      .then(results => {
        return results.length > 0 ? false : true;
      });
  },

  getHits(params = {}) {
    const queryParams = [];

    if (params.url) {
      queryParams.push({
        key: "url",
        value: params.url
      });
    }

    if (params.referrer) {
      if (Array.isArray(params.referrer)) {
        params.referrer = params.referrer.reduce((referrers, value) => {
          return [...referrers, `*.${value}`, `${value}`];
        }, []);
      } else {
        params.referrer = [`*.${params.referrer}`, `${params.referrer}`];
      }
      queryParams.push({
        key: "referrer",
        value: params.referrer,
        wildcardMatch: true,
        wildcardCharacter: "*"
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
      queryParams.push({
        key: "timestamp",
        value: new Date(params.from),
        operator: ">="
      });
    }

    if (params.to) {
      queryParams.push({
        key: "timestamp",
        value: new Date(params.to),
        operator: "<="
      });
    }

    return storage.find("hits", queryParams);
  }
};
