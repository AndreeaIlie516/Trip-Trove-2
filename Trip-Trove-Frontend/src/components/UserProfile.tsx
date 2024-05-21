import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/User";
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

export function UserProfile() {
  const { user, getUserById } = useAuth();
  const [profile, setProfile] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const id = user.ID.toString();
          const userProfile = await getUserById(id);
          setProfile(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }
      }
    };

    fetchUserProfile();
  }, [user, getUserById]);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "50vh",
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
            height: "350px",
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
            Your profile
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
            paddingBottom: "100px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "2em",
            }}
          >
            <Card sx={{ maxWidth: 600, width: "100%", padding: "2em" }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  User Profile
                </Typography>
                <Typography variant="body1">
                  Name: {profile.first_name} {profile.last_name}
                </Typography>
                <Typography variant="body1">Email: {profile.email}</Typography>
                <Typography variant="body1">
                  Username: {profile.username}
                </Typography>
                <Typography variant="body1">
                  Phone Number: {profile.phone_number}
                </Typography>
                <Typography variant="body1">
                  Date of Birth: {profile.date_of_birth}
                </Typography>
                <Typography variant="body1">
                  Address: {profile.address}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
        <Box sx={{ gridArea: "sidebar" }}></Box>
        <Footer />
      </Box>
    </Box>
  );
}
