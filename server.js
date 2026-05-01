const express = require("express");
const http = require("http");
const Corrosion = require("corrosion");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Create Corrosion instance
const corrosion = new Corrosion({
  prefix: "/service/",
  codec: "xor",
  ws: true,
  origin: true,
  bundle: false
});

// Serve static files from /public
app.use(express.static("public"));

// Corrosion request handler - MUST be last
app.use((req, res) => {
  corrosion.request(req, res);
});

// Start server
server.listen(PORT, () => {
  console.log(`NullForge proxy running on port ${PORT}`);
});
