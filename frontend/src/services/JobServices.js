import requests from "./httpRequest";

const JobServices = {
  getAllJobs: async () => requests.get("/jobs"),
  getAllJobsFilter: async (query) => requests.get(`/jobs?${query}`),
  getJob: async (id) => requests.get(`/jobs/${id}`),
  createJob: async (body) => requests.post("/jobs", body),
  updateJob: async (id, body) => requests.put(`/jobs/${id}`, body),
  deleteJob: async (id) => requests.delete(`/jobs/${id}`),
};

export default JobServices;
