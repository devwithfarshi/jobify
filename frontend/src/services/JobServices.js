import requests from "./httpRequest";

const JobServices = {
  getAllJobs: async (query = null) =>
    requests.get(query ? `/jobs?${query}` : "/jobs"),
  getJob: async (id) => requests.get(`/jobs/${id}`),
  getJobsByCompany: async (companyId) =>
    requests.get(`/jobs/company/${companyId}`),
  createJob: async (body) => requests.post("/jobs", body),
  updateJob: async (id, body) => requests.put(`/jobs/${id}`, body),
  deleteJob: async (id) => requests.delete(`/jobs/${id}`),
  getAllLocations: async () => requests.get("/jobs/get/locations"),
  getAllJobTypes: async () => requests.get("/jobs/get/job-types"),
  getAllExperienceLevels: async () =>
    requests.get("/jobs/get/experience-levels"),
  getAllIndustries: async () => requests.get("/jobs/get/industries"),
  generateJobDescription: async (body) =>
    requests.post("/jobs/generate-description", body),
};

export default JobServices;
