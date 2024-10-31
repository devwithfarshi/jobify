const http = require("http");
const app = require("./app");

// Start the server
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
