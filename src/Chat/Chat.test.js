import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve('# Quantum Vantage Consciousness Model')
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('renders loading indicator on startup', () => {
  render(<App />);
  const loader = screen.getByRole('progressbar');
  expect(loader).toBeInTheDocument();
});
