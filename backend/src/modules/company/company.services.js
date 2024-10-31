const companyModel = require("./company.models");
const jobServices = require("../job/job.services");
const getAllCompanies = async (query, paginateOptions) => {
  try {
    const companies = await companyModel.paginate(query, paginateOptions);
    return companies;
  } catch (error) {
    throw error;
  }
};

const createCompany = async (body) => {
  try {
    const company = companyModel.create(body);
    return company;
  } catch (error) {
    throw error;
  }
};

const updateCompany = async (id, body) => {
  try {
    const company = await companyModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    return company;
  } catch (error) {
    throw error;
  }
};

const deleteCompany = async (id) => {
  try {
    await companyModel.findByIdAndDelete(id);
    await jobServices.deleteJobsByCompany(id);
    return true;
  } catch (error) {
    throw error;
  }
};

const getCompany = async (id) => {
  try {
    const company = await companyModel.findById(id);
    return company;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompany,
};
