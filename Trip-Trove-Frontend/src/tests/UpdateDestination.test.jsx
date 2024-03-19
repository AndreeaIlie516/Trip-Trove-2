import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdateDestination } from '../components/UpdateDestination';
import { DestinationProvider } from '../contexts/DestinationContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));


test('renders Loading... screen', () => {
  render(
    <DestinationProvider>
      <UpdateDestination />
    </DestinationProvider>
  );
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
