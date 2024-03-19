import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDestinations } from "../contexts/DestinationContext";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Button,
  Box,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

export function DestinationGrid() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { destinations, deleteDestination } = useDestinations();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleClickOpen = (id: number) => {
    console.log("Delete button clicked");
    setOpen(true);
    setDeleteId(id);
  };

  const handleClose = () => {
    console.log("Delete dialog closed");
    setOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete dialog confirmed");
    if (deleteId) {
      deleteDestination(deleteId);
      setDeleteId(null);
    }
    setOpen(false);
  };

  const handleSortChange = (event: SelectChangeEvent<"asc" | "desc">) => {
    setSortOrder(event.target.value as "asc" | "desc");
  };

  const sortedDestinations = useMemo(() => {
    return [...destinations].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.visitors_last_year - b.visitors_last_year;
      } else {
        return b.visitors_last_year - a.visitors_last_year;
      }
    });
  }, [destinations, sortOrder]);

  const currentDestinations = destinations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <>
      <Button
        component={Link}
        to={`/destinations/add`}
        style={{ marginTop: "20px", marginBottom: "40px" }}
      >
        Add New Destination
      </Button>
      <FormControl fullWidth>
        <InputLabel id="sort-order-select-label">Sort Order</InputLabel>
        <Select
          labelId="sort-order-select-label"
          id="sort-order-select"
          value={sortOrder}
          label="Sort Order"
          onChange={handleSortChange}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Visitors last year</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDestinations.map((destination) => (
              <TableRow key={destination.id}>
                <TableCell>{destination.name}</TableCell>
                <TableCell>{destination.location}</TableCell>
                <TableCell>{destination.country}</TableCell>
                <TableCell>{destination.visitors_last_year}</TableCell>
                <TableCell>
                  <CardMedia
                    component="img"
                    alt="Destination"
                    height="250"
                    image={destination.image_url}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/destinations/${destination.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    view details
                  </Button>
                  <Button
                    component={Link}
                    to={`/destinations/update/${destination.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Update
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleClickOpen(destination.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2.2em",
        }}
      >
        <Pagination
          count={Math.ceil(destinations.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this destination?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
