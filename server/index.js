const express = require("express");
const path = require("path");
const app = express();
const { upload } = require("./s3");

app.use(express.static(path.join(__dirname, "build")));
require("../src/setupProxy")(app);

app.get("/healthcheck/heartbeat", function (req, res) {
  res.send("system is up.");
  res.end();
});

app.post(
  "panels/upload",
  upload.single("panelImage"),
  function (req, res, next) {
    res.send("panel successfully uploaded");
  }
);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.SERVER_PORT || 8080);
