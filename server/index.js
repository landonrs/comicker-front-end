const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));
require("../src/setupProxy")(app);

app.get("/healthcheck/heartbeat", function (req, res) {
  res.send("system is up.");
  res.end();
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.SERVER_PORT || 8080);
