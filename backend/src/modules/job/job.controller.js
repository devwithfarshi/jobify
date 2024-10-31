const ApiResponse = require("@/utils/apiResponse");
const jobServices = require("./job.services");
const companyServices = require("../company/company.services");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("@/utils/apiError");
const createJob = async (req, res, next) => {
  try {
    const companyExits = await companyServices.getCompany(req.body.company);
    if (!companyExits) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiError(StatusCodes.NOT_FOUND, "Company not found"));
    }
    const job = await jobServices.createJob(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(StatusCodes.CREATED, job, "Job created successfully")
      );
  } catch (error) {
    next(error);
  }
};
const getAllJobs = async (req, res, next) => {
  const {
    page,
    limit,
    location,
    title,
    search,
    jobType,
    experienceLevel,
    remote,
    industry,
  } = req.query;

  let query = {};

  if (location) query.location = { $regex: location, $options: "i" };
  if (title) query.title = { $regex: title, $options: "i" };
  if (search) query.title = { $regex: search, $options: "i" };
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (remote) query.remote = remote === true;
  if (industry) query.industry = { $regex: industry, $options: "i" };

  try {
    const jobs = await jobServices.getAllJobs(query, { page, limit });

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, jobs, "Jobs retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const job = await jobServices.getJob(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, job, "Job retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await jobServices.updateJob(req.params.id, req.body);
    return res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, job, "Job updated successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await jobServices.deleteJob(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.NO_CONTENT,
          { _id: job._id },
          "Job deleted successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
