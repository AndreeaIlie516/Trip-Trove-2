import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  Modal,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Login } from "./Login";
import { useAuth } from "../contexts/AuthContext";

export const ResponsiveAppBar: React.FC = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  let pages: string[] = ["Destinations", "Locations"];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigate = (page: string) => {
    if (page === "Destinations") {
      navigate("/");
    } else if (page === "Locations") {
      navigate("/locations");
    } else if (page === "Login") {
      navigate("/login");
    } else if (page === "Register") {
      navigate("/register");
    } else if (page === "My Account") {
      navigate("/account");
    }
    handleCloseNavMenu();
  };

  const handleOpenLoginModal = () => {
    setOpenLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setOpenLoginModal(false);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar
            src={logo}
            alt="Logo"
            sx={{
              display: { xs: "none", md: "flex" },
              marginRight: "8px",
              marginLeft: { md: "2em" },
              width: "65px",
              height: "65px",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Trip Trove
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigate(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigate(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {isLoggedIn ? (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                marginRight: { md: "3em" },
                width: "400px",
                height: "65px",
              }}
            >
              <Typography sx={{ marginRight: "1em" , marginTop: "1.2em"}}>
                Welcome, {user?.first_name}
              </Typography>
              <Button
                color="inherit"
                onClick={() => handleNavigate("My Account")}
              >
                My Account
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log Out
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                marginRight: { md: "12em" },
                width: "65px",
                height: "65px",
              }}
            >
              <Button
                color="inherit"
                sx={{ marginRight: "3em" }}
                onClick={() => handleNavigate("Login")}
              >
                Log In
              </Button>

              <Button
                color="inherit"
                sx={{ marginRight: "3em" }}
                onClick={() => handleNavigate("Register")}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
