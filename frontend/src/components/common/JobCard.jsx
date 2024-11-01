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
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2),
}));
const JobCard = ({ job, onDelete, onEdit }) => {
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
              <Button
                onClick={() => onEdit(job._id)}
                variant="contained"
                color="primary"
                fullWidth
              >
                Edit
              </Button>
              <Button
                onClick={() => onDelete(job)}
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
