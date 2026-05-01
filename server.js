const express = require("express");
const { WispServer } = require("@mercuryworkshop/wisp-js");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from /public
app.use(express.static("public"));

// Create Wisp server and mount it at /wisp
const wisp = new WispServer({
  server: app,
  path: "/wisp"
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
