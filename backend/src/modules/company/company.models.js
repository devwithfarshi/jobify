const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    logo: {
      type: String, // URL comes from cloudinary
    },
  },
  {
    timestamps: true,
  }
);

companySchema.plugin(paginate);

module.exports = mongoose.model("company", companySchema);
