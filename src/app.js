const express = require("express");
const app = express();

app.get("/test", (req, res) => {
  res.send("Hello test Server");
});

app.get("/", (req, res) => {
  res.send("Hello Hero");
});

app.listen("3000", () => {
  console.log("Server is succesfully listening on port 3000");
});
