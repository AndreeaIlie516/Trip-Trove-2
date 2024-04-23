import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";
import { Box, Typography, Divider } from "@mui/material";
import { ILocation } from "../interfaces/Location";
import { useLocations } from "../contexts/LocationContext";

export function LocationDetails() {
  const { id } = useParams<{ id: string }>();
  const { getLocationById } = useLocations();
  const [location, setLocation] = useState<ILocation | undefined>();

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!id) {
        return null;
      }
      const fetchedLocation = await getLocationById(parseInt(id));
      setLocation(fetchedLocation);
    };
    fetchLocationDetails();
  }, [id, getLocationById]);

  if (!location) {
    return (
      <Typography variant="h4" align="center">
        Loading...
      </Typography>
    );
  } else {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
          width: "100vw",
        }}
      >
        <ResponsiveAppBar />
        <Box
          sx={{
            borderRadius: "1em",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "1080px",
            margin: "20px",
            padding: "20px",
            backgroundColor: "white",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: "center", mb: 2 }}
          >
            {location.name}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ mb: 2 }}>
            {"Country:  " + (location.country || "N/A")}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {"Description:  " +
              (location.description || "No description provided")}
          </Typography>
        </Box>
        <Footer />
      </Box>
    );
  }
}
