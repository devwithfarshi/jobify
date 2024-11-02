import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import CompanyServices from "../../../services/CompanyServices";
import JobServices from "../../../services/JobServices";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleCreate } from "../../../redux/features/JobSlice";

const initialJobData = {
  title: "",
  description: "",
  salary: "",
  location: "",
  requirements: [""],
  applyLink: "",
  company: "",
  jobType: "",
  experienceLevel: "",
  industry: "",
  remote: false,
  skills: [""],
};

const CreateNewJobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [jobData, setJobData] = useState(initialJobData);
  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await CompanyServices.getAllCompanies();
        setAllCompanies(response.data.docs);
      } catch (error) {
        console.log(error);
        setAllCompanies([]);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, name, index) => {
    const { value } = e.target;
    setJobData((prev) => {
      const updatedArray = [...prev[name]];
      updatedArray[index] = value;
      return { ...prev, [name]: updatedArray };
    });
  };

  const handleAddRequirementOrSkill = (name) => {
    setJobData((prev) => ({ ...prev, [name]: [...prev[name], ""] }));
  };

  const handleRemoveRequirementOrSkill = (name, index) => {
    setJobData((prev) => {
      const updatedArray = prev[name].filter((_, i) => i !== index);
      return { ...prev, [name]: updatedArray };
    });
  };

  const validateJobData = () => {
    if (!jobData.title) {
      toast.error("Title is required.");
      return false;
    }
    if (!jobData.description) {
      toast.error("Description is required.");
      return false;
    }
    if (!jobData.salary) {
      toast.error("Salary is required.");
      return false;
    }
    if (!jobData.location) {
      toast.error("Location is required.");
      return false;
    }
    if (!jobData.requirements.every((req) => req)) {
      toast.error("All requirements are required.");
      return false;
    }
    if (!jobData.applyLink) {
      toast.error("Apply Link is required.");
      return false;
    }
    if (!selectedCompany) {
      toast.error("Company is required.");
      return false;
    }
    if (!jobData.jobType) {
      toast.error("Job Type is required.");
      return false;
    }
    if (!jobData.experienceLevel) {
      toast.error("Experience Level is required.");
      return false;
    }
    if (!jobData.industry) {
      toast.error("Industry is required.");
      return false;
    }
    if (!jobData.skills.every((skill) => skill)) {
      toast.error("All skills are required.");
      return false;
    }
    return true;
  };

  // handle generate description from server with AI
  const handleGenerateDescription = async () => {
    if (
      !jobData.title ||
      !jobData.company ||
      !jobData.skills ||
      !jobData.industry
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    setLoading(true);
    try {
      const response = await JobServices.generateJobDescription({
        jobTitle: jobData.title,
        companyName: jobData.company,
        skills: jobData.skills,
        industry: jobData.industry,
      });
      if (response.success) {
        setJobData((prev) => ({
          ...prev,
          description: response.data.description,
        }));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
      toast.error(
        error.response.data.message || "Failed to generate description"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateJobData()) return;

    try {
      const body = {
        ...jobData,
        company: selectedCompany,
      };

      const response = await JobServices.createJob(body);
      if (response.success) {
        toast.success("Job created successfully!");
        dispatch(handleCreate(response.data));
        setJobData(initialJobData);
        navigate("/dashboard/jobs");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error(
        error.response?.data.message || error?.message || "Failed to create job"
      );
    }
  };

  return (
    <Container
      maxWidth="md"
      className="flex items-center justify-center h-full"
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          height: "95%",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create New Job
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Job Title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Salary"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Location"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Company"
                name="company"
                value={jobData.company}
                onChange={handleChange}
                fullWidth
                required
              >
                {allCompanies.map((company) => (
                  <MenuItem
                    key={company._id}
                    onClick={() => setSelectedCompany(company._id)}
                    value={company.name}
                  >
                    {company.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Apply Link"
                name="applyLink"
                value={jobData.applyLink}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Job Type"
                name="jobType"
                value={jobData.jobType}
                onChange={handleChange}
                fullWidth
                required
              >
                {[
                  "Full-time",
                  "Part-time",
                  "Contract",
                  "Temporary",
                  "Internship",
                ].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Experience Level"
                name="experienceLevel"
                value={jobData.experienceLevel}
                onChange={handleChange}
                fullWidth
                required
              >
                {["Entry", "Mid", "Senior", "Director"].map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Industry"
                name="industry"
                value={jobData.industry}
                onChange={handleChange}
                fullWidth
                required
              >
                {["IT & Software", "Finance", "Healthcare"].map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Requirements */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Requirements</Typography>
              {jobData.requirements.map((req, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                  <TextField
                    name="requirements"
                    value={req}
                    onChange={(e) =>
                      handleArrayChange(e, "requirements", index)
                    }
                    fullWidth
                  />
                  <Button
                    onClick={() =>
                      handleRemoveRequirementOrSkill("requirements", index)
                    }
                    disabled={jobData.requirements.length === 1}
                    sx={{ ml: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                onClick={() => handleAddRequirementOrSkill("requirements")}
                sx={{ mt: 1 }}
              >
                Add Requirement
              </Button>
            </Grid>

            {/* Skills */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Skills</Typography>
              {jobData.skills.map((skill, index) => (
                <Box key={index} display="flex" alignItems="center" mt={1}>
                  <TextField
                    name="skills"
                    value={skill}
                    onChange={(e) => handleArrayChange(e, "skills", index)}
                    fullWidth
                  />
                  <Button
                    onClick={() =>
                      handleRemoveRequirementOrSkill("skills", index)
                    }
                    disabled={jobData.skills.length === 1}
                    sx={{ ml: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button
                onClick={() => handleAddRequirementOrSkill("skills")}
                sx={{ mt: 1 }}
              >
                Add Skill
              </Button>
            </Grid>

            {/* Remote */}
            <Grid item xs={12}>
              <TextField
                select
                label="Remote"
                name="remote"
                value={jobData.remote ? "Yes" : "No"}
                onChange={(e) =>
                  setJobData((prev) => ({
                    ...prev,
                    remote: e.target.value === "Yes",
                  }))
                }
                fullWidth
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={loading}
                onClick={handleGenerateDescription}
                className="mb-2"
                variant="outlined"
              >
                {loading ? "Loading..." : "Generate Description"}
              </Button>
              <TextField
                label="Description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
                className="resize"
                sx={{
                  "& .resize": {
                    resize: "unset",
                  },
                }}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Create Job
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateNewJobs;
