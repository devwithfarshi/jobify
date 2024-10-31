const ApiResponse = require("@/utils/apiResponse");
const userServices = require("./users.services");
const { StatusCodes } = require("http-status-codes");
const ApiError = require("@/utils/apiError");

const getAllUsers = async (req, res, next) => {
  const { page, limit, name, email, search } = req.query;
  let query = {};
  if (name) query.name = { $regex: name, $options: "i" };
  if (email) query.email = { $regex: email, $options: "i" };
  if (search)
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

  try {
    const users = await userServices.getAllUsers(query, {
      page,
      limit,
      select: "-password -__v",
    });
    return res.json(
      new ApiResponse(StatusCodes.OK, users, "All users retrieved successfully")
    );
  } catch (error) {
    return next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const user = await userServices.getUserById(req.params.id);
    return res.json(
      new ApiResponse(StatusCodes.OK, user, "User retrieved successfully")
    );
  } catch (error) {
    return next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const user = await userServices.deleteUserById(req.params.id);

    return res.json(
      new ApiResponse(
        StatusCodes.OK,
        { _id: user._id, email: user.email },
        "User deleted successfully"
      )
    );
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userServices.updateUserById(req.params.id, req.body);
    return res.json(
      new ApiResponse(StatusCodes.OK, user, "User updated successfully")
    );
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
