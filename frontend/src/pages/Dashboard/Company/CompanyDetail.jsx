import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CompanyServices from "../../../services/CompanyServices";
import JobServices from "../../../services/JobServices";
import JobCard from "../../../components/common/JobCard";
import {
  CircularProgress,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Divider,
  Container,
} from "@mui/material";

const CompanyDetail = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyAndJobs = async () => {
      setLoading(true);
      try {
        const companyResponse = await CompanyServices.getCompany(companyId);
        const jobsOfCompanyResponse = await JobServices.getJobsByCompany(
          companyId
        );

        setCompany(companyResponse.data);
        setJobs(jobsOfCompanyResponse.data);
      } catch (error) {
        console.error("Failed to fetch company details and jobs:", error);
        setError("Failed to load company details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyAndJobs();
  }, [companyId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh", py: 4 }}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
        {company?.logo && (
          <Avatar
            src={company.logo}
            alt={company.name}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
        )}
        <Typography variant="h4" fontWeight="bold">
          {company?.name}
        </Typography>
      </Box>

      {company?.description && (
        <Box display="flex" justifyContent="center" mb={4}>
          <Paper
            elevation={3}
            sx={{ p: 3, maxWidth: 800, textAlign: "center" }}
          >
            <Typography variant="body1" color="text.secondary">
              {company.description}
            </Typography>
          </Paper>
        </Box>
      )}

      <Divider variant="middle" sx={{ mb: 4 }} />

      <Box textAlign="center" mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Opening Jobs at this Company
        </Typography>
      </Box>

      <Container maxWidth="lg">
        {jobs.length > 0 ? (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <JobCard job={job} />
            ))}
          </Grid>
        ) : (
          <Box display="flex" justifyContent="center" mt={4}>
            <Typography variant="body1" color="text.secondary">
              No jobs available for ${company.name} company.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CompanyDetail;
