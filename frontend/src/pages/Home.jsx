import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import JobServices from "../services/JobServices";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    location: "",
    title: "",
    jobType: "",
    experienceLevel: "",
    remote: "",
    industry: "",
    limit: 10,
    page: 1,
  });

  // Fetch jobs with filters and pagination
  const fetchJobs = async () => {
    try {
      let data;
      if (
        filters.location ||
        filters.title ||
        filters.jobType ||
        filters.experienceLevel ||
        filters.remote ||
        filters.industry ||
        filters.limit ||
        filters.page
      ) {
        let query = "";
        for (const key in filters) {
          if (filters[key]) {
            query += `${key}=${filters[key]}&`;
          }
        }
        data = await JobServices.getAllJobsFilter(query);
      } else {
        data = await JobServices.getAllJobs();
      }

      setJobs(data.data.docs); // Access jobs from `docs` array (mongoose-paginate-v2 structure)
      setTotalPages(data.data.totalPages); // Set total pages for pagination
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const columns = [
    { field: "title", headerName: "Job Title", width: 200 },
    {
      field: "company",
      headerName: "Company",
      width: 150,
      valueGetter: (params) => params.row?.company?.name || "N/A",
    },
    { field: "location", headerName: "Location", width: 150 },
    { field: "salary", headerName: "Salary", width: 130 },
    { field: "jobType", headerName: "Job Type", width: 120 },
    { field: "experienceLevel", headerName: "Experience Level", width: 150 },
    {
      field: "applyLink",
      headerName: "Apply Link",
      width: 150,
      renderCell: (params) => (
        <a
          href={params.row.applyLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply
        </a>
      ),
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box className="my-4 text-center">
        <h2 className="text-teal-950 text-3xl font-semibold">
          Jobify Opening Jobs
        </h2>
      </Box>

      {/* Filter Form */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Job Title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Industry"
            name="industry"
            value={filters.industry}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Job Type"
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Experience Level"
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Entry">Entry</MenuItem>
            <MenuItem value="Mid">Mid</MenuItem>
            <MenuItem value="Senior">Senior</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Remote"
            name="remote"
            value={filters.remote}
            onChange={handleFilterChange}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Remote</MenuItem>
            <MenuItem value="false">On-site</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => fetchJobs()} fullWidth>
            Apply Filters
          </Button>
        </Grid>
      </Grid>

      {/* Job Data Grid */}
      <Box
        sx={{
          height: 600,
          width: "100%",
          bgcolor: "#f9fafb",
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
        }}
      >
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={(row) => row._id}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          slots={{ toolbar: GridToolbar }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#e0f2f1",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-footerContainer": { bgcolor: "#e0f2f1" },
            "& .MuiDataGrid-row:hover": { bgcolor: "#f1f8e9" },
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSize={10}
        />
      </Box>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default JobList;
