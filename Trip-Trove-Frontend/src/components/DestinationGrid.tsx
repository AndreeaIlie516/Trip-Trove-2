import React, { useState } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import DestinationCard from "./DestinationCard";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import { useNavigate } from "react-router-dom";
import { useDestinations } from "../contexts/DestinationContext";
import { Table, TableContainer, TableHead, TableRow, TableCell, Paper, TableBody, Button } from "@mui/material";

const DestinationGrid: React.FC = () => {
  //const { destinations } = useDestinations();
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const nav = useNavigate();

  const { destinations, deleteDestination } = useDestinations();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // return (
  //   <div>
  //     <Grid container columnSpacing={6} rowSpacing={6}>
  //       {destinations
  //         .slice((page - 1) * itemsPerPage, page * itemsPerPage)
  //         .map((destination) => (
  //           <Grid item md={4} key={destination.id}>
  //             <Paper elevation={0}>
  //               <DestinationCard data={destination}></DestinationCard>
  //             </Paper>
  //           </Grid>
  //         ))}
  //     </Grid>
  //     <Box
  //       sx={{ display: "flex", justifyContent: "center", marginTop: "2.2em" }}
  //     >
  //       <Pagination
  //         count={Math.ceil(destinations.length / itemsPerPage)}
  //         page={page}
  //         onChange={handleChange}
  //       />
  //     </Box>
  //   </div>
  // );

  return (
    <>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {destinations && destinations.map((destination) => (
                            <TableRow key={destination.id}>
                                <TableCell>{destination.name}</TableCell>
                                <TableCell>{destination.location}</TableCell>
                                <TableCell>{destination.country}</TableCell>
                                <TableCell>
                                  <CardMedia
                                       component="img"
                                        alt="Destination"
                                        height="250"
                                        image={destination.image_url}
                                      />
                                </TableCell>
                                <TableCell>
                                    <Button color="error" onClick={() => deleteDestination(destination.id)}>Delete</Button>
                                    <Button component={Link} to={`/pets/${destination.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>Update</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button component={Link} to={`/pets/add`}>Add</Button>
        </>
  );
};

export default DestinationGrid;
