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

/**
 * Gets all users.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of users.
 */
const getAllUsers = async () => {
  try {
    return await userModel.find().select("-password -__v");
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a user based on various criteria.
 *
 * @param {Object} body - The search criteria.
 * @param {string} [body.id] - The user's id.
 * @param {string} [body.email] - The user's email.
 * @param {string} [body.phone] - The user's phone number.
 * @param {string} [body.googleId] - The user's Google ID.
 * @returns {Promise<Object>} A promise that resolves to the user if found.
 */
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

/**
 * Retrieves a user by their ID.
 *
 * @param {string} id - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the user if found.
 */
const getUserById = async (id) => {
  try {
    return await userModel.findById(id).select("-password -__v");
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves a user by their email.
 *
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} A promise that resolves to the user if found.
 */
const getUserByEmail = async (email) => {
  try {
    return await userModel.findOne({ email }).select("-password -__v");
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a user by their ID.
 *
 * @param {string} userId - The ID of the user.
 * @param {Object} updateBody - The data to update.
 * @returns {Promise<Object>} A promise that resolves to the updated user.
 */
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

/**
 * Deletes a user by their ID.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the deleted user.
 */
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
