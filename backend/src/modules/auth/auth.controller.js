const { StatusCodes } = require("http-status-codes");

const createAccount = async (req, res) => {
  try {
    // const { email, password } = req.body;
    res.status(StatusCodes.CREATED).json({ message: "Account created" });
    // res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAccount,
};
