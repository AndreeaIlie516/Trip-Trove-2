import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Footer from "../components/Footer";
import { Box, Typography, Divider } from "@mui/material";
import { IDestination } from "../interfaces/Destination";
import { useDestinations } from "../contexts/DestinationContext";

export function Destination() {
  const { id } = useParams<{ id: string }>();
  const { getDestinationById } = useDestinations();
  const [destination, setDestination] = useState<IDestination | undefined>();

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      if (!id) {
        return null;
      }
      const fetchedDestination = await getDestinationById(parseInt(id));
      setDestination(fetchedDestination);
    };
    fetchDestinationDetails();
  }, []);

  console.log("ID: " + id);
  console.log("Destination:" + destination?.ID + " " + destination?.country);

  if (!destination) {
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
              {"Location:  " + destination.location}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {"Country:  " + destination.country}
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
