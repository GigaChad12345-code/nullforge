const express = require("express");
const http = require("http");
const { wispServer } = require("@mercuryworkshop/wisp-js");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from /public
app.use(express.static("public"));

// Create the HTTP server
const server = http.createServer(app);

// Attach Wisp to the HTTP server
wispServer(server, {
  path: "/wisp"
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
