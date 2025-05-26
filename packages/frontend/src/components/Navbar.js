import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Navbar Logout error:", error);
      alert("Çıkış yaparken bir hata oluştu.");
    }
  };

  const userDisplayName = user?.email?.split("@")[0] || "Kullanıcı";

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(44, 83, 100, 0.9)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        elevation={4}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component={RouterLink}
            to={user ? "/home" : "/login"}
            sx={{
              flexGrow: 1,
              fontFamily: "Orbitron, sans-serif",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            GameCenter
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            {user && (
              <Button color="inherit" component={RouterLink} to="/home">
                Ana Sayfa
              </Button>
            )}
            {user ? (
              <>
                <Typography sx={{ color: "#e0e0e0" }}>👤 {userDisplayName}</Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  variant="outlined"
                  sx={{ borderColor: "#e0e0e0", color: "#e0e0e0" }}
                >
                  Çıkış Yap
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{ borderColor: "#e0e0e0", color: "#e0e0e0" }}
              >
                Giriş Yap
              </Button>
            )}
          </Box>

          <IconButton
            color="inherit"
            sx={{ display: { xs: "block", sm: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <List sx={{ width: 200 }}>
              {user && (
                <ListItem button component={RouterLink} to="/home" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary="Ana Sayfa" />
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary={`👤 ${userDisplayName}`} />
              </ListItem>
              <ListItem button onClick={user ? handleLogout : () => navigate("/login")}>
                <ListItemText primary={user ? "Çıkış Yap" : "Giriş Yap"} />
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;
