import { BusinessCenter, Group, LocationOn, School } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
}));
const JobCard = ({ job, onDelete }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Grid item xs={12} sm={6} md={4} key={job._id}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {job.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {job.company?.name || "N/A"}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ my: 2 }}>
            <Chip
              icon={<LocationOn />}
              label={job.location}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<BusinessCenter />}
              label={job.jobType}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Chip
              icon={<School />}
              label={job.experienceLevel}
              size="small"
              color="info"
              variant="outlined"
            />
          </Stack>
          <Typography variant="h6" gutterBottom>
            {job.salary}
          </Typography>
          {!isAuthenticated && (
            <Button
              variant="contained"
              color="primary"
              href={`/jobs/${job._id}`}
              fullWidth
            >
              Apply Now
            </Button>
          )}
          {isAuthenticated && (
            <Box display={"flex"} gap={2}>
              <Button variant="contained" color="primary" fullWidth>
                <Link to={`/dashboard/jobs/edit/${job._id}`}>Edit</Link>
              </Button>
              <Button
                onClick={() => onDelete(job._id)}
                variant="contained"
                color="error"
                fullWidth
              >
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    </Grid>
  );
};
export default JobCard;
