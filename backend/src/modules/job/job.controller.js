const ApiResponse = require("@/utils/apiResponse");
const jobServices = require("./job.services");
const companyServices = require("../company/company.services");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("@/utils/apiError");
const redis = require("@/config/redis");
const { generateJobDescriptionWithOpenAi } = require("@/utils/openAi");

// Utility function for setting Redis cache
const setRedisCache = async (key, value, expiration = 300) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", expiration);
  } catch (error) {
    console.error(`Error setting cache for ${key}:`, error);
  }
};

// Utility function for getting Redis cache
const getRedisCache = async (key) => {
  try {
    const cachedValue = await redis.get(key);
    return cachedValue ? JSON.parse(cachedValue) : null;
  } catch (error) {
    console.error(`Error getting cache for ${key}:`, error);
    return null;
  }
};

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
  if (title) query.title = { $regex: title, $options: "i" };
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (remote) query.remote = remote === "true";
  if (industry) query.industry = industry;
  if (location) query.location = location;
  if (search) query.title = { $regex: search, $options: "i" };

  const cacheKey = `jobs:${JSON.stringify(query)}:${page}:${limit}`;

  try {
    const cachedJobs = await getRedisCache(cacheKey);
    if (cachedJobs) {
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            cachedJobs,
            "Jobs retrieved from cache successfully"
          )
        );
    }

    const jobs = await jobServices.getAllJobs(query, {
      page,
      limit,
      populate: "company",
    });
    await setRedisCache(cacheKey, jobs);

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
    const cachedJob = await getRedisCache(`job:${req.params.id}`);
    if (cachedJob) {
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            cachedJob,
            "Job retrieved successfully"
          )
        );
    }

    const job = await jobServices.getJob(req.params.id);
    await setRedisCache(`job:${req.params.id}`, job);

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
          { _id: req.params.id },
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

const getAllLocations = async (req, res, next) => {
  const cacheKey = "locations";
  try {
    // Check if data is in cache
    const cachedLocations = await redis.get(cacheKey);
    if (cachedLocations) {
      const locations = JSON.parse(cachedLocations);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            locations,
            "Locations retrieved from cache successfully"
          )
        );
    }

    const locations = await jobServices.getAllLocations();
    await redis.set(cacheKey, JSON.stringify(locations), "EX", 300);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          locations,
          "Locations retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getAllJobTypes = async (req, res, next) => {
  const cacheKey = "jobTypes";
  try {
    // Check if data is in cache
    const cachedJobTypes = await redis.get(cacheKey);
    if (cachedJobTypes) {
      const jobTypes = JSON.parse(cachedJobTypes);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            jobTypes,
            "Job Types retrieved from cache successfully"
          )
        );
    }

    const jobTypes = await jobServices.getAllJobTypes();
    await redis.set(cacheKey, JSON.stringify(jobTypes), "EX", 300);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          jobTypes,
          "Job Types retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getAllExperienceLevel = async (req, res, next) => {
  const cacheKey = "experienceLevels";
  try {
    // Check if data is in cache
    const cachedExperienceLevels = await redis.get(cacheKey);
    if (cachedExperienceLevels) {
      const experienceLevels = JSON.parse(cachedExperienceLevels);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            experienceLevels,
            "Experience Levels retrieved from cache successfully"
          )
        );
    }

    const experienceLevels = await jobServices.getAllExperienceLevel();
    await redis.set(cacheKey, JSON.stringify(experienceLevels), "EX", 300);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          experienceLevels,
          "Experience Levels retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getAllIndustry = async (req, res, next) => {
  const cacheKey = "industries";
  try {
    const cachedIndustries = await redis.get(cacheKey);
    if (cachedIndustries) {
      const industries = JSON.parse(cachedIndustries);
      return res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            industries,
            "Industries retrieved from cache successfully"
          )
        );
    }

    const industries = await jobServices.getAllIndustry();
    await redis.set(cacheKey, JSON.stringify(industries), "EX", 300);

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          industries,
          "Industries retrieved successfully"
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
  getAllLocations,
  getAllJobTypes,
  getAllExperienceLevel,
  getAllIndustry,
};
