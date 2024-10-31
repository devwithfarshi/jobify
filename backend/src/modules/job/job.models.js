const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    salary: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    requirements: [String],
    applyLink: String,
    jobType: {
      type: String,
    },
    experienceLevel: String,
    industry: {
      type: String, // E.g., 'IT', 'Finance', 'Healthcare'
    },
    remote: {
      type: Boolean,
      default: false,
    },
    skills: [String],
  },
  {
    timestamps: true,
  }
);

jobSchema.plugin(paginate);

module.exports = mongoose.model("Job", jobSchema);
