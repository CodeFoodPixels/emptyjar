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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

module.exports = {
  removeTrailingSlashes,
  uaParser,
  urlChecker,
  replaceAll
};
