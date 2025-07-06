import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const heading = screen.getByText(/Sorting Algorithm Stability Visualizer/i);
  expect(heading).toBeInTheDocument();
});
