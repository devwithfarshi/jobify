import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import CompanyServices from "../../../services/CompanyServices";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CompanyManager = () => {
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async (page = 1) => {
    setLoading(true);
    try {
      const response = await CompanyServices.getAllCompanies();
      const { docs, totalPages, totalDocs } = response.data;
      setCompanies(docs);
      setPagination((prev) => ({
        ...prev,
        page,
        totalPages,
        totalDocs,
      }));
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handlePageChange = (event, newPage) => {
    fetchCompanies(newPage);
  };

  const handleEdit = (companyId) => {
    // Handle edit functionality here
    console.log("Edit company:", companyId);
  };

  const handleDelete = async (companyId) => {
    try {
      const res = await CompanyServices.deleteCompany(companyId);
      if (res.success) {
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company._id !== companyId)
        );

        toast.success("Company deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
      toast.error("Failed to delete company. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Manage Companies
        </Typography>
        <Button variant="contained" color="primary">
          <Link to="/dashboard/companies/new">Create New Company</Link>
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : companies.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No companies found.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {companies.map((company) => (
              <Grid item xs={12} key={company._id}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <img
                      className="size-20 rounded-md"
                      src={company.logo}
                      alt={company.name}
                    />
                    <Typography variant="h6">{company.name}</Typography>
                    <Typography
                      variant="body2"
                      maxWidth={555}
                      color="text.secondary"
                      my={2}
                    >
                      {company.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Website:</strong>
                      <a href={company.website}>{company.website}</a>
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {company.location}
                    </Typography>
                  </Box>
                  <Box>
                    <Link to={`/dashboard/companies/edit/${company._id}`}>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Link>
                    <IconButton
                      onClick={() => handleDelete(company._id)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
          />
        </Box>
      )}
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        Showing {companies.length} of {pagination.totalDocs} companies
      </Typography>
    </Container>
  );
};

export default CompanyManager;
