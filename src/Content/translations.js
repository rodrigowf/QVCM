const translations = {
  en: {
    // Header
    title: 'Quantum Vantage Consciousness Model',
    subtitle: 'Perception–Decision Duality with Variable Oneness',
    githubRepository: 'GitHub Repository',
    viewRawContent: 'View Raw Content',

    // Tooltips
    switchToLightMode: 'Switch to Light Mode',
    switchToDarkMode: 'Switch to Dark Mode',
    switchToPortuguese: 'Mudar para Português',
    switchToEnglish: 'Switch to English',
    showToc: 'Show ToC',
    hideToc: 'Hide ToC',

    // Loading
    loading: 'Loading...',

    // Footer
    copyright: '© 2025 Rodrigo Werneck Franco. All rights reserved. MIT License.'
  },
  'pt-BR': {
    // Header
    title: 'Modelo de Consciência Quantum Vantage',
    subtitle: 'Dualidade Percepção–Decisão com Unicidade Variável',
    githubRepository: 'Repositório GitHub',
    viewRawContent: 'Ver Conteúdo Original',

    // Tooltips
    switchToLightMode: 'Mudar para Modo Claro',
    switchToDarkMode: 'Mudar para Modo Escuro',
    switchToPortuguese: 'Mudar para Português',
    switchToEnglish: 'Switch to English',
    showToc: 'Mostrar Sumário',
    hideToc: 'Ocultar Sumário',

    // Loading
    loading: 'Carregando...',

    // Footer
    copyright: '© 2025 Rodrigo Werneck Franco. Todos os direitos reservados. Licença MIT.'
  }
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations['en'][key];
};

export default translations;
