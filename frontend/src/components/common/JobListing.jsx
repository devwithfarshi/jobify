import {
  Business,
  BusinessCenter,
  LocationOn,
  School,
  Search,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import JobCard from "./JobCard";
import { useEffect } from "react";
import {
  clearFilters,
  fetchFilterOptions,
  fetchJobs,
  handleJobDelete,
  setFilters,
  setPagination,
} from "../../redux/features/JobSlice";

const JobListing = ({ fromPage }) => {
  const dispatch = useDispatch();
  const { jobs, loading, filters, pagination, filterOptions } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(fetchJobs({ filters, page: pagination.page }));
  }, [dispatch, filters, pagination.page]);
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, []);

  const renderFilterFields = () => (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          name="title"
          value={filters.title}
          onChange={(e) =>
            dispatch(setFilters({ name: "title", value: e.target.value }))
          }
          placeholder="Job Title or Keywords"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
      </Grid>
      {[
        {
          name: "location",
          label: "Location",
          icon: <LocationOn />,
          options: filterOptions.locations,
        },
        {
          name: "industry",
          label: "Industry",
          icon: <Business />,
          options: filterOptions.industries,
        },
        {
          name: "jobType",
          label: "Job Type",
          icon: <BusinessCenter />,
          options: filterOptions.jobTypes,
        },
        {
          name: "experienceLevel",
          label: "Experience Level",
          icon: <School />,
          options: filterOptions.experienceLevels,
        },
      ].map(({ name, label, icon, options }) => (
        <Grid item xs={12} sm={6} md={4} key={name}>
          <TextField
            select
            fullWidth
            name={name}
            value={filters[name]}
            onChange={(e) =>
              dispatch(setFilters({ name, value: e.target.value }))
            }
            label={label}
            InputProps={{ startAdornment: icon }}
          >
            <MenuItem value="">All {label}s</MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ))}
      <Grid item xs={12} md={4}>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={() => dispatch(clearFilters())}
          sx={{ mt: 2 }}
        >
          Clear Filters
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {fromPage === "home" && (
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 1, color: "text.primary", fontWeight: "bold" }}
            >
              Find Your Next Opportunity
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Discover thousands of job opportunities from top companies
            </Typography>
          </Box>
        )}
        <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          {renderFilterFields()}
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : jobs?.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No jobs found. Please adjust your search criteria.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2} mt={4}>
              {jobs?.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onDelete={() => dispatch(handleJobDelete(job._id))}
                />
              ))}
            </Grid>

            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={(e, page) => {
                    dispatch(setPagination(page));
                  }}
                  color="primary"
                  variant="outlined"
                  disabled={loading}
                />
              </Box>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={2}
            >
              Showing {jobs.length} of {pagination.totalDocs} jobs
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
};

export default JobListing;
