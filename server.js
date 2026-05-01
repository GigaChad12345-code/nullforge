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
  logLevel: 0
});

// Serve static files from /public ONLY for actual files
app.use(express.static("public", {
  // Don't serve /service paths through static
  skip: (req) => req.path.startsWith("/service")
}));

// IMPORTANT: Corrosion handler MUST come BEFORE the catch-all
// This handles all /service/* requests
app.all("/service/*", (req, res) => {
  corrosion.request(req, res);
});

// Fallback for index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start server
server.listen(PORT, () => {
  console.log(`NullForge proxy running on http://localhost:${PORT}`);
});
