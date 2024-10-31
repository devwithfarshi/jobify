const ApiResponse = require("@/utils/apiResponse");
const { StatusCodes } = require("http-status-codes");
const { userServices } = require("../users");
const { generateAccessToken } = require("@/utils/jwtToken");
const ApiError = require("@/utils/apiError");

/**
 * Create a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} The promise object that represents the registered user.
 *
 */
const createAccount = async (req, res, next) => {
  try {
    const user = await userServices.createUser(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          user,
          "User Account Created successfully"
        )
      );
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await userServices.getUnprotectedUser(req.body);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Email or Password");
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Email or Password");
    }
    const token = generateAccessToken(user, { role: user.role });
    return res
      .status(StatusCodes.OK)
      .cookie("token", token)
      .json(
        new ApiResponse(StatusCodes.OK, { token }, "Logged in successfully")
      );
  } catch (error) {
    return next(error);
  }
};

const loggedInUser = async (req, res, next) => {
  try {
    const user = await userServices.getUserById(req.user.id);
    return res.json(
      new ApiResponse(StatusCodes.OK, user, "Logged in user details retrieved")
    );
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  createAccount,
  loginUser,
  loggedInUser,
};
