import React from 'react';
import { Header, Title, Subtitle, Links } from '../styled.components';
import { Tooltip, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';


const AppHeader = ({ isDarkMode, toggleDarkMode, isMobile, isTocVisible, toggleTOCVisible, language, toggleLanguage }) => {
  return (
    <Header id="main-header">
      <div className="header-content">
        <Title>Quantum Vantage Consciousness Model</Title>
        <Subtitle>Perception–Decision Duality with Variable Oneness</Subtitle>
        <Links isMobile={isMobile}>
          <a href="https://github.com/rodrigowf/QHCH" target="_blank" rel="noopener noreferrer">GitHub Repository</a> |
          <a href="https://github.com/rodrigowf/QHCH/blob/main/QVCM.md" target="_blank" rel="noopener noreferrer">View Raw Content</a>
        </Links>
      </div>
      {isMobile && (
        <Tooltip
          title={isTocVisible ? "Show ToC" : "Hide ToC"}
          sx={{ position: 'absolute', left: 12 }}
        >
          <IconButton color="inherit" onClick={toggleTOCVisible}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ position: isMobile ? 'fixed' : 'absolute', top: isMobile ? 18 : 'auto', right: 20, display: 'flex', gap: 1 }}>
        <Tooltip title={language === 'en' ? "Mudar para Português" : "Switch to English"}>
          <IconButton color="inherit" onClick={toggleLanguage} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TranslateIcon sx={{ fontSize: 20 }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{language === 'en' ? 'EN' : 'BR'}</span>
          </IconButton>
        </Tooltip>
        <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Header>
  );
};

export default AppHeader; 