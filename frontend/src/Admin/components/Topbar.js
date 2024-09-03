import {Box, IconButton, useTheme, Menu, MenuItem} from "@mui/material";
import {useContext, useState} from "react";
import { useTranslation } from "react-i18next";
import { ColorModeContext, tokens } from "../../theme";
import {InstantSearch, SearchBox, Hits, Highlight} from 'react-instantsearch-dom';
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import searchClient from "../../algoliaClient";



const Topbar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const {i18n} = useTranslation();
  const {t} = useTranslation();
  const [anchorEl, setAnchorEl] = useState();
  

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}
    sx={{
    
      background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,
      
    }}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InstantSearch searchClient={searchClient} indexName="items">
          <SearchBox
            translations={{ placeholder: t('search') }}
            // Styling or additional props can be added here
          />
        </InstantSearch>
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">

        {/*Colormode Toggle*/}
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

         {/*Language Toggle*/}
        <IconButton onClick={handleLanguageMenuOpen}>
          <LanguageOutlinedIcon />
        </IconButton>


        <Menu
        anchorEl = {anchorEl}
        open = {Boolean(anchorEl)}
        onClose = {handleLanguageMenuClose}
        >

          <MenuItem onClick = {() => handleLanguageChange("en")}> {t('english')} </MenuItem>
          <MenuItem onClick = {() => handleLanguageChange("bn")}> বাংলা 
          </MenuItem>

        </Menu>

        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;