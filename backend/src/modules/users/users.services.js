const userModel = require("./users.models");

const createUser = async (userBody) => {
  return await userModel.create(userBody);
};

const getUsers = async (filter, select) => {
  return await userModel.find(filter).select(select);
};

const getUser = async (id) => {
  const user = await userModel.findById(id).select("-password");
  return user;
};

const updateUser = async (id, userBody) => {
  const updatedUserData = await userModel
    .findByIdAndUpdate(id, userBody, {
      new: true,
    })
    .select("-password");
  return updatedUserData;
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
};
