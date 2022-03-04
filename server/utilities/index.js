const uaParser = require("./uaParser");
const urlChecker = require("./urlChecker");

function removeTrailingSlashes(str) {
  if (typeof str !== "string") {
    return str;
  }

  let i = str.length;
  while (str[--i] === "/");
  return str.slice(0, i + 1);
}

module.exports = {
  removeTrailingSlashes,
  uaParser,
  urlChecker
};
