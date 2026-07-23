const cutshort = require("./cutshort");
const naukri = require("./naukri");
const indeed = require("./indeed");
const linkedin = require("./linkedin");

const handlers = {
  cutshort,
  naukri,
  indeed,
  linkedin
};

async function collectByType(type, page, config, debug) {
  const handler = handlers[type];
  if (!handler?.collect) return [];
  return handler.collect(page, config, debug);
}

module.exports = {
  collectByType
};