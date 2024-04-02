import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDestinations } from "../contexts/DestinationContext";
import { IDestination } from "../interfaces/Destination";
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
import { Chart, ChartData, ChartOptions } from "chart.js/auto";

interface CustomChartProps {
  data: ChartData;
  options?: ChartOptions;
}

const CustomChart: React.FC<CustomChartProps> = ({ data, options }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const chartInstance = new Chart(ctx, {
          type: "bar",
          data: data,
          options: options,
        });

        return () => {
          chartInstance.destroy();
        };
      }
    }
  }, [data, options]);

  return <canvas ref={canvasRef} />;
};

function sortDestinations(
  destinations: IDestination[],
  sortOrder: "asc" | "desc" | "recommended"
): IDestination[] {
  switch (sortOrder) {
    case "asc":
      return [...destinations].sort(
        (a, b) => a.visitors_last_year - b.visitors_last_year
      );
    case "desc":
      return [...destinations].sort(
        (a, b) => b.visitors_last_year - a.visitors_last_year
      );
    case "recommended":
    default:
      return [...destinations].sort(
        (a, b) => a.visitors_last_year - b.visitors_last_year
      );
  }
}

export function DestinationGrid() {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "recommended">(
    "asc"
  );

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

  const handleItemsPerPageChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setItemsPerPage(parseInt(value, 10));
    setPage(1);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const sortedDestinations = useMemo(() => {
    if (!destinations || !Array.isArray(destinations)) {
      return [];
    }
    return sortDestinations(destinations, sortOrder);
  }, [destinations, sortOrder]);

  const currentDestinations = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedDestinations.slice(start, start + itemsPerPage);
  }, [page, sortedDestinations, itemsPerPage]);

  const handleSortChange = (
    event: SelectChangeEvent<"asc" | "desc" | "recommended">
  ) => {
    setSortOrder(event.target.value as "asc" | "desc" | "recommended");
    setPage(1);
  };

  const chartData: ChartData = useMemo(() => {
    const visitorsCount: Record<number, number> = {};

    if (destinations && Array.isArray(destinations)) {
      destinations.forEach((destination) => {
        const visitors = destination.visitors_last_year;
        if (visitorsCount[visitors]) {
          visitorsCount[visitors] += 1;
        } else {
          visitorsCount[visitors] = 1;
        }
      });
    } else {
      console.error("destinations is null or not an array:", destinations);
    }

    const labels = Object.keys(visitorsCount).map(
      (visitors) => `${visitors} visitors`
    );
    const data = Object.values(visitorsCount);

    return {
      labels: labels,
      datasets: [
        {
          label: "Number of Destinations",
          data: data,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  }, [destinations]);

  const chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

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
          <MenuItem value="recommended">Recommended</MenuItem>
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
            {currentDestinations.length > 0 ? (
              currentDestinations.map((destination) => (
                <TableRow key={destination.ID}>
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
                      to={`/destinations/${destination.ID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      View Details
                    </Button>
                    <Button
                      component={Link}
                      to={`/destinations/update/${destination.ID}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      Update
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleClickOpen(destination.ID)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  No destinations available. Please add some destinations.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          width: "100%",
          height: "400px",
          marginTop: "40px",
          marginBottom: "20px",
        }}
      >
        <CustomChart data={chartData} options={chartOptions} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2.2em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "2.2em",
            padding: "0 20px",
          }}
        >
          <Pagination
            count={Math.ceil(sortedDestinations.length / itemsPerPage)}
            page={page}
            onChange={handleChange}
            sx={{ marginRight: "20px" }}
          />
          <FormControl sx={{ width: "auto" }}>
            <Select
              labelId="items-per-page-label"
              id="items-per-page-select"
              value={itemsPerPage.toString()}
              label="Items Per Page"
              onChange={handleItemsPerPageChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
