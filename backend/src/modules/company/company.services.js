const companyModel = require("./company.models");

const getAllCompanies = async () => {
  try {
    const companies = await companyModel.find();
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
    return await companyModel.findByIdAndDelete(id);
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
