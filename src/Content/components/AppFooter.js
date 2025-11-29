import React from 'react';
import { Footer } from '../styled.components';
import { getTranslation } from '../translations';

const AppFooter = ({ language = 'en' }) => {
  const t = (key) => getTranslation(language, key);

  return (
    <Footer>
      <p>{t('copyright')}</p>
    </Footer>
  );
};

export default AppFooter; 