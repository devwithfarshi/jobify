const express = require("express");
const router = express.Router();
const validate = require("@/middlewares/validation.middleware");
const authenticate = require("@/middlewares/auth.middleware");
const authorizeRole = require("@/middlewares/authorizeRole.middleware");
const { superAdmin } = require("@/config/constant");
const userController = require("./users.controller");
router.get(
  "/",
  authenticate,
  authorizeRole(superAdmin),
  userController.getAllUsers
);
router.get(
  "/:id",
  authenticate,
  authorizeRole(superAdmin),
  userController.getUserById
);
router.delete(
  "/:id",
  authenticate,
  authorizeRole(superAdmin),
  userController.deleteUser
);
router.put(
  "/:id",
  authenticate,
  authorizeRole(superAdmin),
  userController.updateUser
);
module.exports = router;
