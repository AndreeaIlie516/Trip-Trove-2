import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddDestination } from '../components/AddDestination';
import { DestinationProvider } from '../contexts/DestinationContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

test('renders Add Destination button', () => {
  render(
    <DestinationProvider>
      <AddDestination />
    </DestinationProvider>
  );
  const addButton = screen.getByRole('button', { name: /add destination/i });
  expect(addButton).toBeInTheDocument();
});
