import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocations } from "../contexts/LocationContext";
import ServerCheck from "../components/ServerCheck";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

export function LocationGrid() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { locations, deleteLocation } = useLocations();

  const handleDelete = (id: number) => {
    deleteLocation(id);
    setOpen(false);
  };

  const sortedLocations = useMemo(() => {
    return locations.sort((a, b) => a.name.localeCompare(b.name));
  }, [locations]);

  const currentLocations = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedLocations.slice(start, start + itemsPerPage);
  }, [page, sortedLocations, itemsPerPage]);

  return (
    <>
      <ServerCheck />
      <Button
        component={Link}
        to="/locations/add"
        style={{ marginTop: "20px", marginBottom: "40px" }}
      >
        Add New Location
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="location table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentLocations.length > 0 ? (
              currentLocations.map((location) => (
                <TableRow key={location.ID}>
                  <TableCell>{location.name}</TableCell>
                  <TableCell>{location.country || "N/A"}</TableCell>
                  <TableCell>
                    {location.description || "No description provided"}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/locations/${location.ID}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        marginRight: "8px",
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      component={Link}
                      to={`/locations/update/${location.ID}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        marginRight: "8px",
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      color="error"
                      onClick={() => {
                        setOpen(true);
                        setDeleteId(location.ID);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  No locations available. Please add some locations.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <Pagination
          count={Math.ceil(sortedLocations.length / itemsPerPage)}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
        />
        <FormControl sx={{ minWidth: 50 }}>
          <InputLabel id="items-per-page-label"></InputLabel>
          <Select
            labelId="items-per-page-label"
            id="items-per-page-select"
            value={itemsPerPage.toString()}
            label="Items Per Page"
            onChange={(event) =>
              setItemsPerPage(parseInt(event.target.value, 10))
            }
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this location?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteId!)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
