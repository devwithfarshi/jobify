require("dotenv").config();
const express = require("express");
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const redis = require("./config/redis");

const mongoSanitize = require("express-mongo-sanitize");
const { errorHandler, notFoundHandler } = require("./utils/errorHandler");
const { StatusCodes } = require("http-status-codes");
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
  cookieParser(),
  cors(),
];
app.use(allMiddlewares);
//base route
app.get("/", (_, res) => {
  res.status(StatusCodes.CREATED).json({
    message: "Welcome to the Jobify API😀",
    status: "Success✅",
    server_status: "Working🆙",
    server_time: `${new Date().toLocaleString()}⌛`,
  });
});

// Routes
const baseApi = "/api/v1";
app.use(`${baseApi}/auth`, require("./modules/auth/auth.routes"));
app.use(`${baseApi}/user`, require("./modules/users/users.routes"));
app.use(`${baseApi}/companies`, require("./modules/company/company.routes"));
app.use(`${baseApi}/jobs`, require("./modules/job/job.routes"));

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
