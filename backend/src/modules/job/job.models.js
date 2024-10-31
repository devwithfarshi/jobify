const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const jobSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    salary: String,
    location: String,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
    requirements: [String],
    applyLink: String,
  },
  {
    timestamps: true,
  }
);

jobSchema.plugin(paginate);

module.exports = mongoose.model("Job", jobSchema);
