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
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import JobServices from "../../services/JobServices";
import JobCard from "./JobCard";

const DEFAULT_PAGE_SIZE = 10;
const initialPaginationState = {
  totalDocs: 0,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};

const initialFilters = {
  title: "",
  location: "",
  industry: "",
  jobType: "",
  experienceLevel: "",
};

const JobListing = ({ fromPage }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPaginationState);
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    jobTypes: [],
    experienceLevels: [],
    industries: [],
  });

  const createQueryString = useCallback((filters, page) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", DEFAULT_PAGE_SIZE);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return queryParams.toString();
  }, []);

  const fetchJobs = useCallback(
    async (currentPage = 1) => {
      setLoading(true);
      try {
        const query = createQueryString(filters, currentPage);
        const response = await JobServices.getAllJobs(query);

        if (response.success) {
          const { docs, ...paginationData } = response.data;
          setJobs(docs);
          setPagination(paginationData);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters, createQueryString]
  );

  const fetchFilterOptions = useCallback(async () => {
    try {
      const [locations, types, experience, industries] = await Promise.all([
        JobServices.getAllLocations(),
        JobServices.getAllJobTypes(),
        JobServices.getAllExperienceLevels(),
        JobServices.getAllIndustries(),
      ]);
      setFilterOptions({
        locations: locations.data || [],
        jobTypes: types.data || [],
        experienceLevels: experience.data || [],
        industries: industries.data || [],
      });
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchJobs(pagination.page);
  }, [fetchJobs, pagination.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const renderFilterFields = () => (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
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
            onChange={handleFilterChange}
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
          onClick={clearFilters}
          sx={{ mt: 2 }}
        >
          Clear Filters
        </Button>
      </Grid>
    </Grid>
  );

  const handleJobDelete = async (jobId) => {
    try {
      const response = await JobServices.deleteJob(jobId);
      if (response.success) {
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
        toast.success("Job deleted successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete job");
    }
  };

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
        ) : jobs.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No jobs found. Please adjust your search criteria.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2} mt={4}>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} onDelete={handleJobDelete} />
              ))}
            </Grid>

            {pagination.totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
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
