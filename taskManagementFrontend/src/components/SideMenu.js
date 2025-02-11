import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, AppBar, Toolbar, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import "./style.css";

const SideMenu = ({ menuOpen, toggleMenu, toggleLanguage, lang, userRole, onLogout }) => {
  return (
    <>
      {/* Transparent AppBar with full width including Logout button and centered user role title */}
      <AppBar position="fixed" className="custom-app-bar">
        <Toolbar>
          {/* Menu icon for opening the side menu */}
          <IconButton edge="start" onClick={toggleMenu} className="menu-icon">
            <MenuIcon />
          </IconButton>
          
          {/* Centered Title showing user role */}
          <Typography 
            variant="h6" 
            sx={{ 
              position: "absolute", 
              left: "50%", 
              transform: "translateX(-50%)", 
              color: "#4A628A" 
            }}
          >
            {userRole === "admin"
              ? "Admin Dashboard"
              : `User Dashboard (${userRole})`}
          </Typography>
          
          {/* Logout button positioned at the far right */}
          <Button 
            color="inherit" 
            onClick={onLogout}
            sx={{ position: "absolute", right: "16px" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer for the side menu */}
      <Drawer open={menuOpen} onClose={toggleMenu}>
        <List>
          <ListItem button onClick={toggleMenu}>
            <ListItemText primary={lang === "en" ? "Home" : "الرئيسية"} />
          </ListItem>
          <ListItem button onClick={toggleMenu}>
            <ListItemText primary={lang === "en" ? "Tasks" : "المهام"} />
          </ListItem>
          <ListItem button onClick={toggleMenu}>
            <ListItemText primary={lang === "en" ? "Settings" : "الإعدادات"} />
          </ListItem>
          {/* Language toggle */}
          <ListItem button onClick={toggleLanguage}>
            <ListItemText primary={lang === "en" ? "Arabic Language" : "اللغة الإنجليزية"} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SideMenu;
