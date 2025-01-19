import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const SideMenu = ({ menuOpen, toggleMenu, toggleLanguage, lang }) => {
  return (
    <>
      {/* IconButton with white icon color */}
      <IconButton
        onClick={toggleMenu}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'transparent', 
          color: '#f9f9f9', 
          borderRadius: '50%', 
          padding: '10px', 
        }}
      >
        <MenuIcon />
      </IconButton>

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
          {/* Language toggle item */}
          <ListItem button onClick={toggleLanguage}>
            <ListItemText primary={lang === "en" ? "Arabic Language" : "اللغة الإنجليزية"} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default SideMenu;
