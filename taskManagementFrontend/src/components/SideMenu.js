import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, AppBar, Toolbar, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import "./style.css";

const SideMenu = ({ menuOpen, toggleMenu, toggleLanguage, lang, userRole, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    toggleMenu();
    navigate(path);
  };

  return (
    <>
      {/* AppBar with flex layout */}
      <AppBar position="fixed" className="custom-app-bar">
        <Toolbar className="toolbar">
          {/* Menu icon always on the left */}
          <IconButton edge="start" onClick={toggleMenu} className="menu-icon">
            <MenuIcon />
          </IconButton>

          {/* Centered Title */}
          <Typography variant="h6" className="title">
            {userRole === "admin"
              ? t("adminDashboard")
              : `${t("userDashboard")} (${userRole})`}
          </Typography>

          {/* Logout button always on the right */}
          <Button color="inherit" onClick={onLogout} className="logout-button">
            {t("logout")}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer for the side menu */}
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
        PaperProps={{
          style: { left: 0, right: "auto" },
        }}
        className="drawer"
      >
        <List>
          <ListItem button onClick={() => handleNavigation('/')} className="list-item">
            <ListItemText primary={lang === "en" ? "Home" : "الرئيسية"} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/tasks')} className="list-item">
            <ListItemText primary={lang === "en" ? "Tasks" : "المهام"} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/dashboard')} className="list-item">
            <ListItemText primary={lang === "en" ? "Dashboard" : "لوحة المعلومات"} />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/settings')} className="list-item">
            <ListItemText primary={lang === "en" ? "Settings" : "الإعدادات"} />
          </ListItem>
          <ListItem button onClick={toggleLanguage} className="list-item">
            <ListItemText primary={lang === "en" ? "Arabic Language" : "اللغة الإنجليزية"} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SideMenu;