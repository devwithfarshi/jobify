const express = require("express");
const router = express.Router();
const authenticate = require("@/middlewares/auth.middleware");
const { superAdmin, admin } = require("@/config/constant");
const authorizeRole = require("@/middlewares/authorizeRole.middleware");
const validate = require("@/middlewares/validation.middleware");
const jobController = require("./job.controller");
const JobValidation = require("./job.validation");

router.get(
  "/",
  validate(JobValidation.jobSearchValidation),
  jobController.getAllJobs
);
router.get("/:id", jobController.getJob);
router.get("/company/:companyID", jobController.getJobsByCompany);

router.get("/get/locations", jobController.getAllLocations);
router.get("/get/job-types", jobController.getAllJobTypes);
router.get("/get/experience-levels", jobController.getAllExperienceLevel);
router.get("/get/industries", jobController.getAllIndustry);

router.use([authenticate, authorizeRole([superAdmin, admin])]);
router.post(
  "/",
  validate(JobValidation.jobCreateValidation),
  jobController.createJob
);
router.put(
  "/:id",
  // validate(JobValidation.jobUpdateValidation),
  jobController.updateJob
);
router.delete("/:id", jobController.deleteJob);

// AI route
router.post(
  "/generate-description",
  validate(JobValidation.generateDescription),
  jobController.generateJobDescription
);
module.exports = router;
