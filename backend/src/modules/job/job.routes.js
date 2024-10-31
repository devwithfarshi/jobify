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

router.use([authenticate, authorizeRole([superAdmin, admin])]);
router.post(
  "/",
  validate(JobValidation.jobCreateValidation),
  jobController.createJob
);
router.put(
  "/:id",
  validate(JobValidation.jobUpdateValidation),
  jobController.updateJob
);
router.delete("/:id", jobController.deleteJob);
module.exports = router;
