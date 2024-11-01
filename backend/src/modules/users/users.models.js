const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const userSchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    email: {
      type: String,
      set: (val) => val.toLowerCase(),
    },
    role: String,
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(paginate);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("user", userSchema);
