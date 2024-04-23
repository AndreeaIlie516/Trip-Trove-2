import { useEffect, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

export function UpdateDestination() {
  const { getDestinationById, updateDestination } =
    useDestinations();
  const { locations } = useLocations();
  const navigate = useNavigate();
  const { id } = useParams();
  const [destination, setDestination] = useState<IDestination | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchDestinationDetails = async () => {
      if (!id) {
        return null;
      }
      const fetchedDestination = await getDestinationById(parseInt(id));
      setDestination(fetchedDestination);
    };
    fetchDestinationDetails();
  }, [id, getDestinationById]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!destination) {
      return;
    }
    updateDestination(destination);
    navigate("/destinations");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDestination((prevDestination) =>
      prevDestination ? { ...prevDestination, [name]: value } : prevDestination
    );
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setDestination((prevDestination) =>
      prevDestination ? { ...prevDestination, [name]: value } : prevDestination
    );
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    const locationName = event.target.value;
    const selectedLocation = locations.find((loc) => loc.name === locationName);
    if (selectedLocation) {
      setDestination((prev) =>
        prev ? { ...prev, location_id: selectedLocation.ID } : prev
      );
    }
  };

  if (!destination) return <div>Loading...</div>;

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
          name="location_id"
          value={
            destination && locations
              ? locations.find((loc) => loc.ID === destination.location_id)
                  ?.name
              : ""
          }
          onChange={handleLocationChange}
        >
          {locations.map((loc) => (
            <MenuItem key={loc.ID} value={loc.name}>
              {loc.name}
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
        Update Destination
      </Button>
    </form>
  );
}
