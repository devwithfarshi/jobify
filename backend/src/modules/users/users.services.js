const { StatusCodes } = require("http-status-codes");
const userModel = require("./users.models");
const ApiError = require("@/utils/apiError");

const createUser = async (userBody) => {
  try {
    const existingUser = await userModel.findOne({ email: userBody.email });
    if (existingUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already taken");
    }
    return await userModel.create(userBody);
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (query, pageOptions) => {
  try {
    return await userModel.paginate(query, pageOptions);
  } catch (error) {
    throw error;
  }
};

const getUnprotectedUser = async (body) => {
  try {
    const { id, email } = body;
    const query = {};
    if (id) query._id = id;
    if (email) query.email = email;

    return await userModel.findOne(query);
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await userModel.findById(id).select("-password -__v");
  } catch (error) {
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    return await userModel.findOne({ email }).select("-password -__v");
  } catch (error) {
    throw error;
  }
};

const updateUserById = async (userId, updateBody) => {
  try {
    const user = await userModel.findByIdAndUpdate(userId, updateBody, {
      new: true,
    });
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (userId) => {
  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUnprotectedUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
