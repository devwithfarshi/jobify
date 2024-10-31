const jobModels = require("./job.models");

const getAllJobs = async () => {
  try {
    const jobs = await jobModels.find();
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
    const job = await jobModels.findById(id);
    return job;
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
};
