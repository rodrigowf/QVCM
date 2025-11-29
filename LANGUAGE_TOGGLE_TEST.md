# Language Toggle Testing Guide

## Overview
The multilingual support (pt-BR/en) has been implemented for the Content page. This guide will help you test and debug the language toggle functionality.

## What Was Implemented

### Files Created/Modified:
1. **[src/Content/translations.js](src/Content/translations.js)** - NEW
   - Contains all UI text translations for English and Portuguese

2. **[src/Content/components/Header.js](src/Content/components/Header.js)** - MODIFIED
   - Now uses translations for title, subtitle, links, and tooltips

3. **[src/Content/Page.js](src/Content/Page.js)** - MODIFIED
   - Uses translations for loading text
   - Passes language prop to AppFooter

4. **[src/Content/components/AppFooter.js](src/Content/components/AppFooter.js)** - MODIFIED
   - Now uses translations for copyright text

## How to Test

### Step 1: Check the Browser Console
I've added console logging to help debug. Open your browser's Developer Tools (F12) and look for these messages when you toggle the language:

```
[App] Toggling language from en to pt-BR
[App] Language state updated, localStorage set
[ContentPage] Language prop: pt-BR
[ContentPage] Loading text: Carregando...
[Header] Language changed to: pt-BR
[Header] Title translation: Modelo de Consciência Quantum Vantage
```

### Step 2: What Should Change When You Click the Language Button

#### English (EN) State:
- **Title**: "Quantum Vantage Consciousness Model"
- **Subtitle**: "Perception–Decision Duality with Variable Oneness"
- **GitHub Link**: "GitHub Repository"
- **Raw Content Link**: "View Raw Content"
- **Loading Text**: "Loading..."
- **Footer**: "© 2025 Rodrigo Werneck Franco. All rights reserved. MIT License."
- **Tooltips**:
  - Dark Mode: "Switch to Dark Mode" / "Switch to Light Mode"
  - Language: "Mudar para Português"
  - ToC (mobile): "Show ToC" / "Hide ToC"

#### Portuguese (pt-BR) State:
- **Title**: "Modelo de Consciência Quantum Vantage"
- **Subtitle**: "Dualidade Percepção–Decisão com Unicidade Variável"
- **GitHub Link**: "Repositório GitHub"
- **Raw Content Link**: "Ver Conteúdo Original"
- **Loading Text**: "Carregando..."
- **Footer**: "© 2025 Rodrigo Werneck Franco. Todos os direitos reservados. Licença MIT."
- **Tooltips**:
  - Dark Mode: "Mudar para Modo Escuro" / "Mudar para Modo Claro"
  - Language: "Switch to English"
  - ToC (mobile): "Mostrar Sumário" / "Ocultar Sumário"

### Step 3: Verify Markdown Content
The markdown content itself should also change:
- English: Loads `QVCM.md`
- Portuguese: Loads `QVCM.pt-BR.md`

## Debugging Steps

### If the language doesn't toggle:

1. **Check Console Logs**
   - Do you see the `[App] Toggling language` messages?
   - If YES: The toggle function is working, the issue is in the UI
   - If NO: The button click handler might not be connected

2. **Check if translations file is loading**
   - Open Console and type: `import('./src/Content/translations.js').then(m => console.log(m))`
   - You should see the translations object

3. **Check localStorage**
   - Open Console and type: `localStorage.getItem('qhch_language')`
   - Should return 'en' or 'pt-BR'

4. **Force a language**
   - Open Console and type: `localStorage.setItem('qhch_language', 'pt-BR')`
   - Refresh the page
   - The page should load in Portuguese

### If you see React errors:

1. Check the browser console for any import errors
2. Make sure `npm start` is running without errors
3. Try clearing the browser cache and reloading

## Known Behavior

- The language toggle button shows "EN" when in English mode and "BR" when in Portuguese mode
- The language preference is saved to localStorage
- The language button is in the top-right corner of the header
- Both the Content page and Chat page share the same language state

## Next Steps

Once you confirm the language toggle is working:
1. Remove the debug console.log statements if desired
2. Test on mobile view
3. Test with the Chat page to ensure consistency

## Need Help?

If the toggle still doesn't work after following these steps, please share:
1. Any console error messages
2. The console log output when clicking the button
3. Screenshots of the page in both states
