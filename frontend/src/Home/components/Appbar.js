import React, { useContext, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Box, InputBase, IconButton, Typography, useTheme, Menu, MenuItem} from "@mui/material";
import { Search as SearchIcon, DarkModeOutlined as DarkModeOutlinedIcon, LightModeOutlined as LightModeOutlinedIcon, LanguageOutlined as LanguageOutlinedIcon, LoginOutlined as LoginOutlinedIcon } from "@mui/icons-material";
import { ColorModeContext, tokens } from "../../theme";
import {InstantSearch, SearchBox, Hits, Highlight} from 'react-instantsearch-dom';
import searchClient from "../../algoliaClient";

const Appbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElSignIn, setAnchorElSignIn] = useState(null);
  const navigate = useNavigate();

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  const handleSignInMenuOpen = (event) => {
    setAnchorElSignIn(event.currentTarget);
  };

  const handleSignInMenuClose = () => {
    setAnchorElSignIn(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleSignInMenuClose();
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[400]} 100%)`,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography
          variant="h3"
          sx={{
            mr: 5,
            fontWeight: 'bold',
            backgroundColor: colors.primary[400],
            borderRadius: 2,
            color: colors.greenAccent[500],
          }}
        >
          {t('personalCollectionApp')}
        </Typography>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
            <InstantSearch searchClient={searchClient} indexName="items">
            <SearchBox
              translations={{ placeholder: 'Search' }}
              // styling or additional props can be added here
            />
          </InstantSearch>
          <IconButton type="button" sx={{ p: 1, color: colors.grey[100] }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      {/* ICONS */}
      <Box display="flex" gap={2}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Language Toggle */}
        <IconButton onClick={handleLanguageMenuOpen}>
          <LanguageOutlinedIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleLanguageMenuClose}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            {t('english')}
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('bn')}>
            বাংলা
          </MenuItem>
        </Menu>

        {/* Login */}
        <IconButton onClick={handleSignInMenuOpen}>
          <LoginOutlinedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorElSignIn}
          open={Boolean(anchorElSignIn)}
          onClose={handleSignInMenuClose}
        >
          <MenuItem onClick={() => handleNavigation('/login')}>
            {t('Login')}
          </MenuItem>
          <MenuItem onClick={() => handleNavigation('/register')}>
            {t('Register')}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Appbar;
