import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { IDestination } from "../interfaces/Destination";
import { useDestinations } from "../contexts/DestinationContext";
import { useNavigate } from "react-router-dom";

export function AddDestination() {
  const { addDestination, destinations } = useDestinations();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<IDestination>({
    ID: 0,
    name: "",
    location: "",
    country: "",
    visitors_last_year: 0,
    image_url: "",
    description: "",
    is_private: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(destination);
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
      <TextField
        margin="normal"
        fullWidth
        label="Location"
        name="location"
        value={destination.location}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Country"
        name="country"
        value={destination.country}
        onChange={handleChange}
      />
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
