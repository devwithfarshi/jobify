require("dotenv").config();
const express = require("express");
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { errorHandler, notFoundHandler } = require("./utils/errorHandler");

const app = express();
//Middlewares
const allMiddlewares = [
  morgan(process.env.LOGGER_LEVEL === "development" ? "dev" : "combined"),
  helmet(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20000,
  }),
  mongoSanitize(),
  hpp(),
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
];
app.use(allMiddlewares);
//base route
app.get("/", (_, res) => {
  res.json({
    message: "Welcome to the Sotto-Jachai API😀",
    status: "Success✅",
    server_status: "Working🆙",
    server_time: `${new Date().toLocaleString()}⌛`,
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
