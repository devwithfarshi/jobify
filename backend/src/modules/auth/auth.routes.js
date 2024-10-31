const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const authValidation = require("./auth.validation");
const validate = require("@/middlewares/validation.middleware");
const authenticate = require("@/middlewares/auth.middleware");

router.post(
  "/create-account",
  validate(authValidation.createAccount),
  authController.createAccount
);
router.post("/login", validate(authValidation.login), authController.loginUser);
router.get("/me", authenticate, authController.loggedInUser);

module.exports = router;
