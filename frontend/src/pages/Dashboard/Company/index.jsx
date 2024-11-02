import { Delete, Edit } from "@mui/icons-material";
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
import { Link } from "react-router-dom";
import useCompany from "../../../hooks/useCompany";

const CompanyManager = () => {
  const { companies, pagination, loading, handlePageChange, handleDelete } =
    useCompany();
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
                    <Typography
                      variant="h6"
                      component={Link}
                      to={`/dashboard/companies/${company._id}`}
                    >
                      {company.name}
                    </Typography>
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
