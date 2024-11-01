import requests from "./httpRequest";

const CompanyServices = {
  getAllCompanies: async (query = null) =>
    requests.get(query ? `/companies?${query}` : "/companies"),
  getCompany: async (id) => requests.get(`/companies/${id}`),
  createCompany: async (body) => requests.post("/companies", body),
  updateCompany: async (id, body) => requests.put(`/companies/${id}`, body),
  deleteCompany: async (id) => requests.delete(`/companies/${id}`),
};

export default CompanyServices;
