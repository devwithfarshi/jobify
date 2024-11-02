import { useParams } from "react-router-dom";
import JobServices from "../services/JobServices";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import LinkIcon from "@mui/icons-material/Link";
import { marked } from "marked";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await JobServices.getJob(jobId);
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Typography variant="h6" color="error" align="center">
        Job not found
      </Typography>
    );
  }

  // Parse markdown description to HTML
  const parsedDescription = marked.parse(job.description || "");

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ maxWidth: 800, width: "100%", p: 4 }}>
        <Box mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            {job.title}
          </Typography>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <BusinessIcon color="primary" />
            </Grid>
            <Grid item>
              <Typography variant="h6" color="textSecondary">
                {job.company?.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <LocationOnIcon color="primary" />
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {job.location} {job.remote && "(Remote)"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Render parsed markdown content */}
        <Box
          dangerouslySetInnerHTML={{ __html: parsedDescription }}
          sx={{
            "& h1": { fontSize: "1.5rem", fontWeight: "bold", mb: 1 },
            "& h2": { fontSize: "1.25rem", fontWeight: "bold", mb: 1 },
            "& h3": { fontSize: "1.15rem", fontWeight: "bold", mb: 1 },
            "& p": { mb: 2, color: "text.secondary" },
            "& ul": { pl: 3, mb: 2 },
            "& li": { mb: 1, color: "text.secondary" },
          }}
        />

        {job.applyLink && (
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<LinkIcon />}
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Now
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default JobDetails;
