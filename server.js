const express = require("express");
const http = require("http");
const Corrosion = require("corrosion");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Create Corrosion instance with proper settings
const corrosion = new Corrosion({
  prefix: "/service/",
  codec: "xor",
  ws: true,
  logLevel: 0,
  botCheck: false,
  requestInterceptor: false,
  responseInterceptor: false,
  // These are important:
  origin: true,
  bundle: false
});

// Serve static files from /public
app.use(express.static("public"));

// Make sure Corrosion routes are registered before static
app.use("/service", (req, res) => {
  corrosion.request(req, res);
});

// Alternative catch-all for any other /service routes
app.use((req, res) => {
  if (req.path.startsWith("/service")) {
    corrosion.request(req, res);
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`NullForge proxy running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
