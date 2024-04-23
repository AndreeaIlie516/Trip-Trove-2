import { useEffect, useState } from "react";
import { Button, TextField, FormControl } from "@mui/material";
import { ILocation, ILocationServer } from "../interfaces/Location";
import { useLocations } from "../contexts/LocationContext";
import { useNavigate, useParams } from "react-router-dom";

export function UpdateLocation() {
  const { getLocationById, updateLocation } = useLocations();
  const navigate = useNavigate();
  const { id } = useParams();
  const [location, setLocation] = useState<ILocation | undefined>(undefined);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!id) {
        return;
      }
      const fetchedLocation = await getLocationById(parseInt(id));
      setLocation(fetchedLocation);
    };
    fetchLocationDetails();
  }, [id, getLocationById]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location) {
      return;
    }
    updateLocation(location);
    navigate("/locations");
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLocation((prevLocation) =>
      prevLocation ? { ...prevLocation, [name]: value } : prevLocation
    );
  };

  if (!location) return <div>Loading...</div>;

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
        value={location.country || ""}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Description"
        name="description"
        type="text"
        value={location.description || ""}
        onChange={handleChange}
      />

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Update Location
      </Button>
    </form>
  );
}
