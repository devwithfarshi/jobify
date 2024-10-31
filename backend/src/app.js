const express = require("express");
const httpStatus = require("http-status");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// base route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Jobify API",
  });
});

module.exports = app;
