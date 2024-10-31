const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const validate = require("@/middlewares/validation.middleware");

router.post(
  "/create-account",
  validate(authValidation.createAccount),
  authController.createAccount
);

module.exports = router;
