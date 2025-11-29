import bundles, { getAgentPrompts, getAvailableAgents } from '../index';

describe('Prompt bundles', () => {
  test('EN bundle exposes unified agents', () => {
    const agents = getAvailableAgents('en');
    expect(Array.isArray(agents)).toBe(true);
    const ids = agents.map(a => a.id);
    expect(ids).toEqual(expect.arrayContaining(['specialist', 'sage']));

    const prompts = getAgentPrompts('en');
    expect(typeof prompts.specialist.systemPrompt).toBe('string');
    expect(typeof prompts.sage.systemPrompt).toBe('string');
    expect(prompts.specialist.systemPrompt).toMatch(/Perception = quantum superposition/);
    expect(prompts.sage.systemPrompt).toMatch(/Quantum triad anchors/);
  });

  test('PT-BR bundle exposes unified agents', () => {
    const agents = getAvailableAgents('pt-BR');
    expect(Array.isArray(agents)).toBe(true);
    const ids = agents.map(a => a.id);
    expect(ids).toEqual(expect.arrayContaining(['specialist', 'sage']));

    const prompts = getAgentPrompts('pt-BR');
    expect(typeof prompts.specialist.systemPrompt).toBe('string');
    expect(typeof prompts.sage.systemPrompt).toBe('string');
    expect(prompts.specialist.systemPrompt).toMatch(/Percepção = Superposição quântica|Percepção = Superposição/);
    expect(prompts.sage.systemPrompt).toMatch(/Guia espiritual|Princípios/);
  });
});
