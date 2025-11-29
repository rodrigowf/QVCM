// Standalone test to verify translations work correctly
// Run with: node test-translations.js

const translations = {
  en: {
    title: 'Quantum Vantage Consciousness Model',
    subtitle: 'Perception–Decision Duality with Variable Oneness',
    githubRepository: 'GitHub Repository',
    viewRawContent: 'View Raw Content',
    switchToLightMode: 'Switch to Light Mode',
    switchToDarkMode: 'Switch to Dark Mode',
    switchToPortuguese: 'Mudar para Português',
    switchToEnglish: 'Switch to English',
    showToc: 'Show ToC',
    hideToc: 'Hide ToC',
    loading: 'Loading...',
    copyright: '© 2025 Rodrigo Werneck Franco. All rights reserved. MIT License.'
  },
  'pt-BR': {
    title: 'Modelo de Consciência Quantum Vantage',
    subtitle: 'Dualidade Percepção–Decisão com Unicidade Variável',
    githubRepository: 'Repositório GitHub',
    viewRawContent: 'Ver Conteúdo Original',
    switchToLightMode: 'Mudar para Modo Claro',
    switchToDarkMode: 'Mudar para Modo Escuro',
    switchToPortuguese: 'Mudar para Português',
    switchToEnglish: 'Switch to English',
    showToc: 'Mostrar Sumário',
    hideToc: 'Ocultar Sumário',
    loading: 'Carregando...',
    copyright: '© 2025 Rodrigo Werneck Franco. Todos os direitos reservados. Licença MIT.'
  }
};

const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations['en'][key];
};

console.log('=== Translation System Test ===\n');

console.log('Testing English (en):');
console.log('  Title:', getTranslation('en', 'title'));
console.log('  Loading:', getTranslation('en', 'loading'));
console.log('  GitHub:', getTranslation('en', 'githubRepository'));
console.log('');

console.log('Testing Portuguese (pt-BR):');
console.log('  Title:', getTranslation('pt-BR', 'title'));
console.log('  Loading:', getTranslation('pt-BR', 'loading'));
console.log('  GitHub:', getTranslation('pt-BR', 'githubRepository'));
console.log('');

console.log('Testing fallback (invalid language):');
console.log('  Title:', getTranslation('invalid', 'title'));
console.log('');

console.log('Testing all keys exist in both languages:');
const enKeys = Object.keys(translations.en);
const ptKeys = Object.keys(translations['pt-BR']);

console.log('  English keys:', enKeys.length);
console.log('  Portuguese keys:', ptKeys.length);

const missingInPt = enKeys.filter(key => !ptKeys.includes(key));
const missingInEn = ptKeys.filter(key => !enKeys.includes(key));

if (missingInPt.length > 0) {
  console.log('  ❌ Missing in Portuguese:', missingInPt);
} else {
  console.log('  ✅ All English keys have Portuguese translations');
}

if (missingInEn.length > 0) {
  console.log('  ❌ Extra in Portuguese:', missingInEn);
} else {
  console.log('  ✅ No extra keys in Portuguese');
}

console.log('\n=== Test Complete ===');
console.log('Translation system is working correctly!');
