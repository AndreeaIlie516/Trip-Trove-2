import { useState } from "react";
import { Button, TextField, FormControl } from "@mui/material";
import { ILocation } from "../interfaces/Location";
import { useLocations } from "../contexts/LocationContext";
import { useNavigate } from "react-router-dom";

export function AddLocation() {
  const { addLocation } = useLocations();
  const navigate = useNavigate();
  const [location, setLocation] = useState<ILocation>({
    ID: 0,
    name: "",
    country: "",
    description: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addLocation(location);
    navigate("/locations");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        margin="normal"
        fullWidth
        label="Name"
        name="name"
        value={location.name}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Country"
        name="country"
        value={location.country}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Description"
        name="description"
        type="text"
        value={location.description}
        onChange={handleChange}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Location
      </Button>
    </form>
  );
}
