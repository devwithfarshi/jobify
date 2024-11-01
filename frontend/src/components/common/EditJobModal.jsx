import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import JobServices from "../../services/JobServices";

const EditJobModal = ({ open, jobId, filterOptions, onClose, onSave }) => {
  const [job, setJob] = useState({});
  const [updatedJobValues, setUpdatedJobValues] = useState({});
  useEffect(() => {
    const fetchJob = async () => {
      const response = await JobServices.getJob(jobId);
      setJob(response.data);
      setUpdatedJobValues(response.data);
    };
    try {
      fetchJob();
    } catch (error) {
      onClose();
    }
  }, [jobId]);

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedJobValues((prev) => ({ ...prev, [name]: value }));
  };
  return (
    jobId && (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  name="title"
                  fullWidth
                  value={updatedJobValues.title || ""}
                  onChange={handleEditInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  name="location"
                  fullWidth
                  select
                  value={updatedJobValues.location || ""}
                  onChange={handleEditInputChange}
                >
                  {filterOptions.locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Industry"
                  name="industry"
                  fullWidth
                  select
                  value={updatedJobValues.industry || ""}
                  onChange={handleEditInputChange}
                >
                  {filterOptions.industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Type"
                  name="jobType"
                  fullWidth
                  select
                  value={updatedJobValues.jobType || ""}
                  onChange={handleEditInputChange}
                >
                  {filterOptions.jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Experience Level"
                  name="experienceLevel"
                  fullWidth
                  select
                  value={updatedJobValues.experienceLevel || ""}
                  onChange={handleEditInputChange}
                >
                  {filterOptions.experienceLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  value={updatedJobValues.description || ""}
                  onChange={handleEditInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(job._id, updatedJobValues)}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
};

export default EditJobModal;
