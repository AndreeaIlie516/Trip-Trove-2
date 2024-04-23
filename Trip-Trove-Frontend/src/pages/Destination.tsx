import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";
import { Box, Typography, Divider } from "@mui/material";
import { IDestination } from "../interfaces/Destination";
import { ILocation } from "../interfaces/Location";
import { useDestinations } from "../contexts/DestinationContext";
import { useLocations } from "../contexts/LocationContext";

export function Destination() {
  const { id } = useParams<{ id: string }>();
  const { getDestinationById } = useDestinations();
  const { getLocationById } = useLocations();
  const [destination, setDestination] = useState<IDestination | undefined>();
  const [location, setLocation] = useState<ILocation | undefined>();

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      console.log("Here");
      if (!id) {
        return null;
      }
      const fetchedDestination = await getDestinationById(parseInt(id));
      console.log("!!!Destination!!!: " + fetchedDestination?.description);
      setDestination(fetchedDestination);
    };
    fetchDestinationDetails();
  }, [id, getDestinationById]);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!destination) {
        return null;
      }

      if (!destination.location_id) {
        return null;
      }
      const fetchedLocation = await getLocationById(destination.location_id);
      setLocation(fetchedLocation);
    };

    if (destination) {
      fetchLocationDetails();
    }
  }, [destination, getLocationById]);

  if (!destination || !location) {
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
          }}
        >
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <img
              src={destination.image_url}
              alt="Destination"
              style={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box
            sx={{
              p: 3,
              overflowY: "auto",
              maxHeight: "calc(100vh - 300px - 64px)",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {destination.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {"Location:  " + location.name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {"Country:  " + location.country}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {"Visitors last year:  " + destination.visitors_last_year}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {"Description:  " + destination.description}
            </Typography>
          </Box>
        </Box>
        <Footer />
      </Box>
    );
  }
}
