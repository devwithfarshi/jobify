import { Box, Button, Typography } from "@mui/material";
import JobListing from "../../components/common/JobListing";
import { Link } from "react-router-dom";
import { Add } from "@mui/icons-material";

const Jobs = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box className="flex items-center gap-10">
          <Typography
            variant="h5"
            sx={{ mb: 1, color: "text.primary", fontWeight: "bold" }}
          >
            Manage Jobs
          </Typography>
          <Button variant="contained" className="gap-1.5">
            <Add />
            <Link to="/dashboard/jobs/new">Create Job</Link>
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage all your job listings
        </Typography>
      </Box>
      <JobListing />
    </Box>
  );
};
export default Jobs;
