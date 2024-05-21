import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import background from "../assets/view_background.jpeg";
import { useAuth } from "../contexts/AuthContext";
import { IRegisterRequest } from "../interfaces/User";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    IRegisterRequest & { confirmPassword: string }
  >({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    date_of_birth: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    try {
      await register(formData);
      navigate("/");
    } catch (error: any) {
    
        setError(error.message || "Registration failed. Please try again.");
      }
    }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "0.3fr 3fr 3fr 0.3fr",
          gap: 1,
          gridTemplateRows: "auto",
          gridTemplateAreas: `
            "header header header header"
            "hero hero hero hero"
            "aside main main sidebar"
            "footer footer footer footer"
          `,
        }}
      >
        <Box sx={{ gridArea: "header" }}>
          <ResponsiveAppBar />
        </Box>
        <Box
          sx={{
            gridArea: "hero",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            display: "flex",
            alignItems: "center",
            marginTop: { md: "-0.55em" },
            height: "475px",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            component="div"
            fontSize="70px"
            border="1px"
            sx={{
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
              fontWeight: "bold",
            }}
          >
            Welcome to Trip Trove!
          </Typography>
        </Box>
        <Box sx={{ gridArea: "aside" }}></Box>
        <Box
          sx={{
            gridArea: "main",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <Card sx={{ maxWidth: 400, width: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Register
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  type="text"
                  name="username"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="text"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="text"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  type="date"
                  name="date_of_birth"
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  type="text"
                  name="address"
                  label="Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ gridArea: "sidebar" }}></Box>
        <Footer />
      </Box>
    </Box>
  );
}
