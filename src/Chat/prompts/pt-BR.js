// Brazilian Portuguese prompt bundle for QVCM chat agents
import QVCM_SYSTEM_PROMPT from './qvcm-system';
import enBundle from './en';

const LANGUAGE_INSTRUCTION = `\n\n=== LANGUAGE INSTRUCTION ==============================
IMPORTANT: The user has selected Brazilian Portuguese (pt-BR) as their preferred language.
You MUST respond in Brazilian Portuguese for ALL interactions, regardless of the language used in the prompt above.
Use natural, clear Brazilian Portuguese. Maintain all the technical accuracy and warmth described in your role, but communicate entirely in Portuguese.`;

const agentPrompts = {
  specialist: {
    systemPrompt: QVCM_SYSTEM_PROMPT + LANGUAGE_INSTRUCTION
  },
  sage: {
    systemPrompt: enBundle.agentPrompts.sage.systemPrompt + LANGUAGE_INSTRUCTION
  }
};

const availableAgents = [
  {
    id: 'specialist',
    name: 'Especialista QVCM',
    description: 'Cientista/engenheiro(a) operando estritamente dentro do framework QVCM'
  },
  {
    id: 'sage',
    name: 'Guia Espiritual QVCM',
    description: 'Guia compassivo(a) fundamentado(a) no QVCM com sabedoria Hermética/Hindu'
  }
];

const ptBRBundle = {
  agentPrompts,
  availableAgents
};

export default ptBRBundle;
