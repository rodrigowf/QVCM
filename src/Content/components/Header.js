import React from 'react';
import { Header, Title, Subtitle, Links } from '../styled.components';
import { Tooltip, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import { getTranslation } from '../translations';


const RAW_CONTENT_LINKS = {
  en: 'https://github.com/rodrigowf/QHCH/blob/main/QVCM.md',
  'pt-BR': 'https://github.com/rodrigowf/QHCH/blob/main/QVCM-pt.md'
};

const AppHeader = ({ isDarkMode, toggleDarkMode, isMobile, isTocVisible, toggleTOCVisible, language, toggleLanguage }) => {
  const rawContentLink = RAW_CONTENT_LINKS[language] || RAW_CONTENT_LINKS.en;
  const t = (key) => getTranslation(language, key);

  return (
    <Header id="main-header">
      <div className="header-content">
        <Title>{t('title')}</Title>
        <Subtitle>{t('subtitle')}</Subtitle>
        <Links isMobile={isMobile}>
          <a href="https://github.com/rodrigowf/QHCH" target="_blank" rel="noopener noreferrer">{t('githubRepository')}</a> |
          <a href={rawContentLink} target="_blank" rel="noopener noreferrer">{t('viewRawContent')}</a>
        </Links>
      </div>
      {isMobile && (
        <Tooltip
          title={isTocVisible ? t('hideToc') : t('showToc')}
          sx={{ position: 'absolute', left: 12 }}
        >
          <IconButton color="inherit" onClick={toggleTOCVisible}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ position: isMobile ? 'fixed' : 'absolute', top: isMobile ? 18 : 'auto', right: 20, display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <Tooltip title={isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={language === 'en' ? t('switchToPortuguese') : t('switchToEnglish')}>
          <IconButton color="inherit" onClick={toggleLanguage} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TranslateIcon sx={{ fontSize: 20 }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{language === 'en' ? 'EN' : 'BR'}</span>
          </IconButton>
        </Tooltip>
      </Box>
    </Header>
  );
};

export default AppHeader; 