import { createContext, useCallback, useState, useEffect } from "react";
import { toast } from "sonner";
import JobServices from "../services/JobServices";

export const JobContext = createContext();

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

const JobProvider = ({ children }) => {
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

  // create query string from filters and page number
  const createQueryString = useCallback((filters, page) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", DEFAULT_PAGE_SIZE);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return queryParams.toString();
  }, []);

  // fetch jobs from the server
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

  // fetch filter options
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

  // handle filter change
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // clear filters
  const clearFilters = () => {
    setFilters(initialFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // handle job delete
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
      toast.error(error.response?.data.message || "Failed to delete job");
    }
  };

  // handle create job
  const handleCreate = async (formData) => {
    try {
      const response = await JobServices.createJob(formData);
      if (response.success) {
        setJobs((prevJobs) => [response.data, ...prevJobs]);
        setPagination((prev) => ({
          ...prev,
          totalDocs: prev.totalDocs + 1,
        }));
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  // handle update job
  const handleEdit = async (jobId, formData) => {
    try {
      const response = await JobServices.updateJob(jobId, formData);
      if (response.success) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, ...response.data } : job
          )
        );
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        filters,
        pagination,
        filterOptions,
        handleFilterChange,
        handlePageChange,
        clearFilters,
        handleJobDelete,
        handleCreate,
        handleEdit,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobProvider;
