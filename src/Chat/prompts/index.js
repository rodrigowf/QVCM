import enBundle from './en';
import ptBRBundle from './pt-BR';

const bundles = {
  en: enBundle,
  'pt-BR': ptBRBundle,
};

export const getPromptBundle = (language = 'en') => bundles[language] || enBundle;

export const getAgentPrompts = (language) => getPromptBundle(language).agentPrompts;
export const getAvailableAgents = (language) => getPromptBundle(language).availableAgents;
export const getQvcmContent = (language) => getPromptBundle(language).QVCM_CONTENT;
export const getSageAddendumContent = (language) => getPromptBundle(language).SAGE_ADDENDUM_CONTENT;

export default bundles;
