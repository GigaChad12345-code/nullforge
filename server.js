const express = require("express");
const path = require("path");
const { createServer } = require("@mercuryworkshop/wisp-server");

const app = express();
const wisp = createServer();

app.use(express.static(path.join(__dirname, "public")));

app.use("/wisp/", wisp.app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Wisp proxy running on port " + PORT);
});
