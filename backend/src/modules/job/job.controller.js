const ApiResponse = require("@/utils/apiResponse");
const jobServices = require("./job.services");
const companyServices = require("../company/company.services");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("@/utils/apiError");
const redis = require("@/config/redis");
const { generateJobDescriptionWithOpenAi } = require("@/utils/openAi");

const createJob = async (req, res, next) => {
  try {
    const companyExists = await companyServices.getCompany(req.body.company);
    if (!companyExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new ApiError(StatusCodes.NOT_FOUND, "Company not found"));
    }
    const job = await jobServices.createJob(req.body);
    await redis.del("jobs");
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
    page = 1,
    limit = 10,
    location,
    title,
    search,
    jobType,
    experienceLevel,
    remote,
    industry,
  } = req.query;

  const query = {};
  if (location) query.location = new RegExp(location, "i");
  if (title) query.title = new RegExp(title, "i");
  if (search) query.title = new RegExp(search, "i");
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (remote) query.remote = remote === "true";
  if (industry) query.industry = new RegExp(industry, "i");

  const cacheKey = `jobs:${JSON.stringify(query)}:${page}:${limit}`;

  try {
    const cachedJobs = await redis.get(cacheKey);

    if (cachedJobs) {
      const jobs = JSON.parse(cachedJobs);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            jobs,
            "Jobs retrieved from cache successfully"
          )
        );
    }

    const jobs = await jobServices.getAllJobs(query, {
      page,
      limit,
      populate: "company",
    });

    await redis.set(cacheKey, JSON.stringify(jobs), "EX", 300);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          jobs,
          "Jobs retrieved from database successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const cachedJob = await redis.get(`job:${req.params.id}`);
    if (cachedJob) {
      const job = JSON.parse(cachedJob);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(StatusCodes.OK, job, "Job retrieved successfully")
        );
    }
    const job = await jobServices.getJob(req.params.id);
    await redis.set(`job:${req.params.id}`, JSON.stringify(job));
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
    await redis.del("jobs");
    await redis.del(`job:${req.params.id}`);
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
    await redis.del("jobs");
    await redis.del(`job:${req.params.id}`);
    return res
      .status(StatusCodes.NO_CONTENT)
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

const generateJobDescription = async (req, res, next) => {
  try {
    const { companyName, jobTitle, industry, skills } = req.body;
    const description = await generateJobDescriptionWithOpenAi(
      companyName,
      jobTitle,
      industry,
      skills
    );
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          { description },
          "Job description generated successfully"
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
  generateJobDescription,
};
