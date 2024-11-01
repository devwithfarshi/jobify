import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
} from "@mui/material";
import UserService from "../../../services/UserServices";
import AuthService from "../../../services/AuthService";
import { toast } from "sonner";

const CreateNewUser = ({ onCreateUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.createAccount(formData);
      if (response.success) {
        toast.success("User created successfully.");
        setFormData(() => ({}));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error(
        error.response.data.message ||
          "Failed to create user. Please try again."
      );
    }
  };

  return (
    <Container className="h-full flex items-center justify-center">
      <Box
        sx={{
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create New User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange}>
              <MenuItem value="super-admin">Super Admin</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button type="submit" variant="contained" color="primary">
              Create User
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateNewUser;
