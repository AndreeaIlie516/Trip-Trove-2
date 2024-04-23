import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { IDestination } from "../interfaces/Destination";
import { useDestinations } from "../contexts/DestinationContext";
import { useLocations } from "../contexts/LocationContext";
import {  useNavigate } from "react-router-dom";

export function AddDestination() {
  const { addDestination, destinations } = useDestinations();
  const { locations } = useLocations();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<IDestination>({
    ID: 0,
    name: "",
    location_id: 0,
    visitors_last_year: 0,
    image_url: "",
    description: "",
    is_private: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addDestination(destination);
    navigate("/destinations");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDestination((prevDestination) => ({
      ...prevDestination,
      [name]: name === "visitors_last_year" ? parseInt(value, 10) : value,
    }));
  };

  const [selectedLocationName, setSelectedLocationName] = useState("");

  useEffect(() => {
    const selectedLocation = locations.find(
      (loc) => loc.ID === destination.location_id
    );
    setSelectedLocationName(selectedLocation ? selectedLocation.name : "");
  }, [destination.location_id, locations]);

  const handleLocationChange = (event: SelectChangeEvent) => {
    const locationName = event.target.value;
    const selectedLocation = locations.find((loc) => loc.name === locationName);
    if (selectedLocation) {
      setDestination((prev) => ({
        ...prev,
        location_id: selectedLocation.ID,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        margin="normal"
        fullWidth
        label="Name"
        name="name"
        value={destination.name}
        onChange={handleChange}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          label="Location"
          value={selectedLocationName}
          onChange={handleLocationChange}
        >
          {locations.map((location) => (
            <MenuItem key={location.ID} value={location.name}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        margin="normal"
        fullWidth
        label="Visistors last year"
        name="visitors_last_year"
        type="number"
        value={destination.visitors_last_year}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Image Url"
        name="image_url"
        value={destination.image_url}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Description"
        name="description"
        value={destination.description}
        onChange={handleChange}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Destination
      </Button>
    </form>
  );
}
