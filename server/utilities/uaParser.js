const bowser = require("bowser");

module.exports = uaString => {
  const userAgent = bowser.parse(uaString);

  const operating_system_version =
    userAgent?.os?.name?.toLowerCase() === "windows"
      ? userAgent?.os?.versionName
      : userAgent?.os?.version;

  return {
    device_type: userAgent?.platform?.type || "Unknown",
    browser:
      `${userAgent?.browser?.name || ""} ${userAgent?.browser?.version ||
        ""}`.trim() || "Unknown",
    operating_system:
      `${userAgent?.os?.name || ""} ${operating_system_version || ""}`.trim() ||
      "Unknown"
  };
};
