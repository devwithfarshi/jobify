const express = require("express");
const router = express.Router();
const companyController = require("./company.controller");
const authenticate = require("@/middlewares/auth.middleware");
const { superAdmin, admin } = require("@/config/constant");
const upload = require("@/middlewares/multer.middleware.js");
const authorizeRole = require("@/middlewares/authorizeRole.middleware");
const validate = require("@/middlewares/validation.middleware");
const companyValidation = require("./company.validation");

router.use([authenticate, authorizeRole([superAdmin, admin])]);

router
  .route("/")
  .post(
    upload.single("logo"),
    validate(companyValidation.createCompany),
    companyController.createCompany
  )
  .get(companyController.getAllCompanies);
router
  .route("/:id")
  .get(companyController.getCompany)
  .put(
    upload.single("logo"),
    validate(companyValidation.updateCompany),
    companyController.updateCompany
  )
  .delete(companyController.deleteCompany);
module.exports = router;
