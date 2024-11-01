import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogOut from "@mui/icons-material/Logout";
import { DocumentScanner, Menu, X } from "@mui/icons-material";
const sidebarWidth = 280;
const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon fontSize="small" />,
  },
  {
    title: "Companies",
    path: "/dashboard/companies",
    icon: <BusinessIcon fontSize="small" />,
  },
  {
    title: "My Jobs",
    path: "/dashboard/jobs",
    icon: <DocumentScanner fontSize="small" />,
  },
  {
    title: "Users",
    path: "/dashboard/users",
    icon: <PeopleIcon fontSize="small" />,
  },
  {
    type: "divider",
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: <SettingsIcon fontSize="small" />,
  },
  {
    title: "Help Center",
    path: "#",
    icon: <HelpOutlineIcon fontSize="small" />,
  },
];
const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic, e.g., clearing tokens, redirecting to login, etc.
    navigate("/login"); // Adjust path as needed
  };

  const drawer = (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: ".2rem",
            }}
          >
            Jobify
          </Typography>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle} sx={{ ml: 1 }}>
              <X size={24} />
            </IconButton>
          )}
        </Box>

        <List sx={{ px: 0 }}>
          {menuItems.map((item, index) =>
            item.type === "divider" ? (
              <Box
                key={index}
                sx={{ my: 2, borderTop: 1, borderColor: "divider" }}
              />
            ) : (
              <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { bgcolor: "primary.dark" },
                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color:
                        location.pathname === item.path
                          ? "inherit"
                          : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Box>

      <Box sx={{ p: 2, mt: "auto" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ borderRadius: 1, "&:hover": { bgcolor: "error.lighter" } }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogOut size={22} color={theme.palette.error.main} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ color: "error.main", fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            left: 16,
            top: 16,
            bgcolor: "background.paper",
            boxShadow: 1,
            zIndex: theme.zIndex.drawer + 2,
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          <Menu size={24} />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: isMobile ? "block" : "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            backgroundImage: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
