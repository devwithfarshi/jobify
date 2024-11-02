import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserService from "../../../services/UserServices";
import useAuth from "../../../hooks/useAuth";
const Users = () => {
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers(pagination.page);
  }, [pagination.page]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers(`page=${page}`);
      setUsers(response.data.docs);
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalDocs: response.data.totalDocs,
        limit: response.data.limit,
      });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setSnackbarMessage("Failed to fetch users. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchUsers(newPage);
  };

  const handleEdit = (user) => {
    setCurrentUser(() => user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await UserService.deleteUser(userId);
      setSnackbarMessage("User deleted successfully.");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      setSnackbarMessage("Failed to delete user. Please try again.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await UserService.updateUser(currentUser._id, formData);
      if (response.success) {
        setUsers((prevUsers) => {
          const index = prevUsers.findIndex(
            (user) => user._id === currentUser._id
          );
          prevUsers[index] = response.data;
          return [...prevUsers];
        });
        setSnackbarMessage("User updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      setSnackbarMessage("Failed to update user. Please try again.");
    } finally {
      setSnackbarOpen(true);
      setEditModalOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" component="h1">
          Manage Users
        </Typography>
        <Button variant="contained" color="primary">
          <Link to="/dashboard/users/new">Create New User</Link>
        </Button>
      </Box>

      <Grid container spacing={2}>
        {users?.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: 3,
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {user.name} {loggedInUser._id === user._id && "(You)"}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.role}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <IconButton color="primary" onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  {loggedInUser._id !== user._id && (
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {currentUser ? "Edit User" : "Create User"}
          </Typography>
          <form onSubmit={handleUpdate}>
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

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Role</InputLabel>
              <Select name="role" value={formData.role} onChange={handleChange}>
                <MenuItem value="super-admin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button type="submit" variant="contained" color="primary">
                {currentUser ? "Update User" : "Create User"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Container>
  );
};

export default Users;
