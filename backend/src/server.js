require("module-alias/register");
const http = require("http");
const app = require("./app");
const ConnectDB = require("./config/db");

ConnectDB();

// Start the server
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
