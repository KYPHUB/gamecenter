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
          background: mode === "dark"
            ? "rgba(20,20,20,0.85)"
            : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          color: mode === "dark" ? "#ffffff" : "#1a1a1a",
          transition: "all 0.3s ease"
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 72,
            px: { xs: 2, sm: 4 }
          }}
        >
          <Typography
            variant="h4"
            component={RouterLink}
            to={user ? "/home" : "/login"}
            sx={{
              fontWeight: 700,
              textDecoration: "none",
              color: "inherit",
              letterSpacing: 0.8,
              textShadow: mode === "dark" ? "0 0 6px #00e5ff44" : "none",
              '&:hover': { opacity: 0.9 },
              fontSize: { xs: "1.4rem", sm: "1.8rem" }
            }}
          >
            GameCenter
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
            {user && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/home"
                sx={{
                  fontWeight: 500,
                  px: 2.5,
                  py: 1,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  '&:hover': { backgroundColor: mode === "dark" ? '#333' : '#eee' }
                }}
              >
                {t("home")}
              </Button>
            )}

            <Tooltip title={t("theme")}>
              <IconButton onClick={toggleTheme} sx={{ p: 1.25 }}>
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <Button
              onClick={toggleLanguage}
              sx={{
                fontWeight: 600,
                border: "1px solid",
                borderColor: mode === "dark" ? "#aaa" : "#333",
                borderRadius: 3,
                px: 2,
                py: 0.8,
                textTransform: "none",
                fontSize: "0.85rem",
                minWidth: 44
              }}
            >
              {i18n.language === "tr" ? "ENG" : "TR"}
            </Button>

            {user ? (
              <>
                <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
                  👤 {userDisplayName}
                </Typography>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  color="inherit"
                  sx={{
                    fontWeight: 500,
                    px: 2.5,
                    py: 0.8,
                    borderRadius: 3,
                    borderColor: mode === "dark" ? "#aaa" : "#555",
                    textTransform: "none",
                    fontSize: "0.95rem"
                  }}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  px: 2.5,
                  py: 0.8,
                  borderRadius: 3,
                  borderColor: mode === "dark" ? "#aaa" : "#555",
                  textTransform: "none",
                  fontSize: "0.95rem"
                }}
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

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 240,
                bgcolor: mode === "dark" ? "#1a1a1a" : "#f9f9f9"
              }
            }}
          >
            <List>
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
