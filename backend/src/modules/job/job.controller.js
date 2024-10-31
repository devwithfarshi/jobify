const ApiResponse = require("@/utils/apiResponse");
const jobServices = require("./job.services");
const { StatusCodes } = require("http-status-codes");
const createJob = async (req, res, next) => {
  try {
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
  try {
    const jobs = await jobServices.getAllJobs();
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
