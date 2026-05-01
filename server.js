const express = require("express");
const { WispServer } = require("@mercuryworkshop/wisp-js");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve your static files
app.use(express.static("public"));

// Create Wisp server
const wispServer = new WispServer({
  server: app, // attach to express
  path: "/wisp" // your wisp endpoint
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
