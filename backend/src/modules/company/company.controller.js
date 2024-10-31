const { StatusCodes } = require("http-status-codes");
const companyServices = require("./company.services");
const ApiResponse = require("@/utils/apiResponse");
const { uploadFile } = require("@/utils/upload");

const createCompany = async (req, res, next) => {
  try {
    const fileUploadResponse = await uploadFile(req.file.path, {
      resource_type: "image",
    });
    const company = await companyServices.createCompany({
      ...req.body,
      logo: fileUploadResponse?.secure_url || "",
    });
    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          company,
          "Company created successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getAllCompanies = async (req, res, next) => {
  const { page, limit, name, location, website } = req.query;
  let query = {};
  if (name) query.name = { $regex: name, $options: "i" };
  if (location) query.location = { $regex: location, $options: "i" };
  if (website) query.website = { $regex: website, $options: "i" };
  try {
    const companies = await companyServices.getAllCompanies(query, {
      page,
      limit,
    });
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          companies,
          "Companies retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await companyServices.getCompany(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          company,
          "Company retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    if (req.file) {
      const fileUploadResponse = await uploadFile(req.file.path, {
        resource_type: "image",
      });
      req.body.logo = fileUploadResponse?.secure_url || "";
    }

    const company = await companyServices.updateCompany(
      req.params.id,
      req.body
    );
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, company, "Company updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    await companyServices.deleteCompany(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, null, "Company deleted successfully")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
};
