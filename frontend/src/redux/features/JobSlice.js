import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import JobServices from "../../services/JobServices";

const DEFAULT_PAGE_SIZE = 10;

const initialState = {
  jobs: [],
  loading: false,
  filters: {
    title: "",
    location: "",
    industry: "",
    jobType: "",
    experienceLevel: "",
  },
  pagination: {
    totalDocs: 0,
    limit: DEFAULT_PAGE_SIZE,
    totalPages: 1,
    page: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  },
  filterOptions: {
    locations: [],
    jobTypes: [],
    experienceLevels: [],
    industries: [],
  },
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (currentPage, { getState }) => {
    const { filters } = getState().jobs;
    const queryParams = new URLSearchParams();
    queryParams.append("page", currentPage.page);
    queryParams.append("limit", DEFAULT_PAGE_SIZE);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await JobServices.getAllJobs(queryParams.toString());
    return response.data;
  }
);

export const fetchFilterOptions = createAsyncThunk(
  "jobs/fetchFilterOptions",
  async () => {
    const [locations, types, experience, industries] = await Promise.all([
      JobServices.getAllLocations(),
      JobServices.getAllJobTypes(),
      JobServices.getAllExperienceLevels(),
      JobServices.getAllIndustries(),
    ]);
    return {
      locations: locations.data || [],
      jobTypes: types.data || [],
      experienceLevels: experience.data || [],
      industries: industries.data || [],
    };
  }
);

export const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters[action.payload.name] = action.payload.value;
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination.page = action.payload;
    },
    handleJobDelete: (state, action) => {
      state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      toast.success("Job deleted successfully");
    },
    handleCreate: (state, action) => {
      state.jobs.unshift(action.payload);
      state.pagination.totalDocs += 1;
    },
    handleEdit: (state, action) => {
      const index = state.jobs.findIndex(
        (job) => job._id === action.payload._id
      );
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        const { docs, ...paginationData } = action.payload;
        state.jobs = docs;
        state.pagination = paginationData;
        state.loading = false;
      })
      .addCase(fetchJobs.rejected, (state) => {
        state.loading = false;
        toast.error("Failed to fetch jobs");
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  handleJobDelete,
  handleCreate,
  handleEdit,
} = jobSlice.actions;

export default jobSlice.reducer;
