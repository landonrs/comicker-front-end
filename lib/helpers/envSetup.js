const envVars = require("../../envVars.json");

const configPromise = new Promise(async (res) => {
  const runtime = process.env.SYSTEM_ENV || "local";
  const vars = envVars[runtime] || {};

  Object.keys(vars).forEach(function (key) {
    process.env[key] = vars[key];
  });
});

module.exports = configPromise;
