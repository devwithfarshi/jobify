const jobModels = require("./job.models");

const getAllJobs = async (query, paginateOptions) => {
  try {
    const jobs = await jobModels.paginate(query, paginateOptions);
    return jobs;
  } catch (error) {
    throw error;
  }
};

const createJob = async (body) => {
  try {
    const job = jobModels.create(body);
    return job;
  } catch (error) {
    throw error;
  }
};

const updateJob = async (id, body) => {
  try {
    const job = await jobModels.findByIdAndUpdate(id, body, {
      new: true,
    });
    return job;
  } catch (error) {
    throw error;
  }
};

const deleteJob = async (id) => {
  try {
    return await jobModels.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

const deleteJobsByCompany = async (companyID) => {
  try {
    return await jobModels.deleteMany({ company: companyID });
  } catch (error) {
    throw error;
  }
};

const getJob = async (id) => {
  try {
    const job = await jobModels.findById(id).populate("company");
    return job;
  } catch (error) {
    throw error;
  }
};

const getJobsByCompany = async (companyID) => {
  try {
    const jobs = await jobModels
      .find({ company: companyID })
      .populate("company");
    return jobs;
  } catch (error) {
    throw error;
  }
};

const getAllLocations = async () => {
  try {
    const locations = await jobModels.distinct("location");
    return locations;
  } catch (error) {
    throw error;
  }
};

const getAllJobTypes = async () => {
  try {
    const jobTypes = await jobModels.distinct("jobType");
    return jobTypes;
  } catch (error) {
    throw error;
  }
};

const getAllExperienceLevel = async () => {
  try {
    const experienceLevels = await jobModels.distinct("experienceLevel");
    return experienceLevels;
  } catch (error) {
    throw error;
  }
};

const getAllIndustry = async () => {
  try {
    const industries = await jobModels.distinct("industry");
    return industries;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  getJob,
  deleteJobsByCompany,
  getAllLocations,
  getAllJobTypes,
  getAllExperienceLevel,
  getAllIndustry,
  getJobsByCompany,
};
