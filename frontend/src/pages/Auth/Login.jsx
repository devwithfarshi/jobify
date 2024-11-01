import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Eye from "@mui/icons-material/RemoveRedEye";
import EyeOff from "@mui/icons-material/VisibilityOff";
import LogIn from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import Cookie from "js-cookie";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (Cookie.get("token")) {
      navigate("/dashboard");
    }
  }, []);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isEmailValid(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await AuthService.login(formData);
      if (response.success) {
        Cookie.set("token", response.data.token, {
          expires: 7,
        });
        navigate("/dashboard");
      } else {
        throw new Error(response.message || "Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        password: "Invalid email or password",
      }));
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(to right bottom, #f3f4f6, #e5e7eb)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={4} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Header */}
              <Stack spacing={1} alignItems="center">
                <LogIn size={40} color="#1976d2" />
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Welcome Back
                </Typography>
                <Typography color="text.secondary" textAlign="center">
                  Enter your credentials to access your account
                </Typography>
              </Stack>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    autoComplete="email"
                    autoFocus
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            size="large"
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Link
                    href="/forgot-password"
                    variant="body2"
                    sx={{ alignSelf: "flex-end" }}
                    underline="hover"
                  >
                    Forgot password?
                  </Link>

                  <Button
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: "1rem",
                      position: "relative",
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Typography variant="body2" color="text.secondary">
                      Don&apos;t have an account?
                    </Typography>
                    <Link href="/register" variant="body2" underline="hover">
                      Create an account
                    </Link>
                  </Stack>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
