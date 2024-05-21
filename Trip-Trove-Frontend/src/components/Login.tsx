// src/components/Login.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ILoginRequest } from "../interfaces/User";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Footer from "./Footer";
import background from "../assets/view_background.jpeg";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ILoginRequest>({
    email: "",
    password: "",
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
    setError(null);
    try {
      await login(formData);
      navigate("/");
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

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
            justifyContent: "center",
            paddingTop: "20px",
            paddingLeft: "300px",
          }}
        >
          <Card sx={{ maxWidth: 400, width: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Log In
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              <form onSubmit={handleSubmit}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
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
