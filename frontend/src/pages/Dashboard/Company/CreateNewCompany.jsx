import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import useCompany from "../../../hooks/useCompany";
import { useNavigate } from "react-router-dom";

const CreateNewCompany = () => {
  const { handleCreate } = useCompany();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogoChange = (event) => {
    setLogo(event.currentTarget.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Company name is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.website) newErrors.website = "Website is required.";
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = "Invalid website URL.";
    }
    if (!formData.location) newErrors.location = "Location is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("logo", logo);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("website", formData.website);
    formDataToSend.append("location", formData.location);

    setLoading(true);
    try {
      const response = await handleCreate(formDataToSend);
      if (response.success) {
        setSnackbarMessage("Company created successfully");
        navigate("/dashboard/companies");
        setFormData({
          name: "",
          description: "",
          website: "",
          location: "",
        });
        setLogo(null);
      } else {
        throw new Error(response.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Company creation error:", error);
      setSnackbarMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to create company. Please try again."
      );
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Company
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={Boolean(errors.website)}
              helperText={errors.website}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={Boolean(errors.location)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              id="logo-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleLogoChange}
            />
            <label htmlFor="logo-upload">
              <IconButton
                color="primary"
                component="span"
                aria-label="upload logo"
              >
                <PhotoCamera />
              </IconButton>
              <Typography variant="body2" component="span">
                {logo ? logo.name : "Upload Logo"}
              </Typography>
            </label>
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Company"
            )}
          </Button>
        </Box>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CreateNewCompany;
