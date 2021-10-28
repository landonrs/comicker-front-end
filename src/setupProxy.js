const proxy = require("simple-http-proxy");
const proxyList = require("../proxyList.json");

module.exports = function (app) {
  require("../lib/helpers/envSetup");

  app.set("trust proxy", true);

  Object.keys(proxyList).forEach(function (key) {
    console.log(`"setting up proxy for: ${key}"`);
    var proxyOptions = proxyList[key];

    proxyOptions.address = proxyOptions.address.replace(
      /\{(.+)\}/,
      function (match, envVar) {
        return process.env[envVar];
      }
    );

    app.use(
      key,
      proxy(proxyOptions.address, { timeout: proxyOptions.timeout })
    );
  });
};
