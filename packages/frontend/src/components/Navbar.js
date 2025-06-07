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
  Tooltip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeModeContext";
import { useTranslation } from "react-i18next";

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
  const { mode, toggleTheme } = useThemeMode();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Navbar Logout error:", error);
      alert("Çıkış yaparken bir hata oluştu.");
    }
  };

  const userDisplayName = user?.email?.split("@")[0] || t("user");

  const toggleLanguage = () => {
    const nextLang = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(nextLang);
  };

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#1565c0",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to={user ? "/home" : "/login"}
            sx={{
              fontFamily: "Orbitron, sans-serif",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none"
            }}
          >
            GameCenter
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 }}>
            {user && (
              <Button color="inherit" component={RouterLink} to="/home">
                {t("home")}
              </Button>
            )}

            <Tooltip title={t("theme")}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <Button
              onClick={toggleLanguage}
              color="inherit"
              sx={{
                fontWeight: "bold",
                border: "1px solid white",
                borderRadius: "20px",
                px: 1.5,
                minWidth: 40
              }}
            >
              {i18n.language === "tr" ? "ENG" : "TR"}
            </Button>

            {user ? (
              <>
                <Typography sx={{ color: "#e0e0e0" }}>👤 {userDisplayName}</Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  variant="outlined"
                  sx={{ borderColor: "#e0e0e0", color: "#e0e0e0" }}
                >
                  {t("logout")}
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
                {t("login")}
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
            <List sx={{ width: 220 }}>
              {user && (
                <ListItem button component={RouterLink} to="/home" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={t("home")} />
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary={`👤 ${userDisplayName}`} />
              </ListItem>
              <ListItem button onClick={user ? handleLogout : () => navigate("/login")}>
                <ListItemText primary={user ? t("logout") : t("login")} />
              </ListItem>
              <ListItem button onClick={toggleTheme}>
                <ListItemText primary={mode === "dark" ? t("light") : t("dark")} />
              </ListItem>
              <ListItem button onClick={toggleLanguage}>
                <ListItemText primary={i18n.language === "tr" ? "ENG" : "TR"} />
              </ListItem>
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default Navbar;
