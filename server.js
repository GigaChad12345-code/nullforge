const express = require("express");
const path = require("path");
const http = require("http");
const { createBareServer } = require("bare-server-node");
const { uvPath } = require("@titaniumnetwork-dev/ultraviolet");

const app = express();
const server = http.createServer(app);
const bare = createBareServer("/bare/");

app.use(express.static(path.join(__dirname, "public")));
app.use("/uv/", express.static(uvPath));

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log("NullForge running on port " + PORT);
});
