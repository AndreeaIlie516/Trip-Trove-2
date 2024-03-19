import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { Destination } from '../pages/Destination';
import * as DestinationContext from '../contexts/DestinationContext';
import * as LocationContext from '../contexts/LocationContext';

// Mock hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));


describe('Destination Component loading', () => {
    test('renders Loading state before data fetch', async () => {
      render(
        <BrowserRouter>
          <Destination />
        </BrowserRouter>
      );
  
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
  
jest.mock('../contexts/DestinationContext', () => ({
    useDestinations: () => ({
      getDestinationById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Eiffel Tower',
        location: 'Paris',
        country: 'France',
        visitors_last_year: '7 million',
        description: 'An iconic symbol of France.',
        image_url: 'https://example.com/eiffel.jpg',
      }),
    }),
  }));
  
beforeEach(() => {
  jest.spyOn(DestinationContext, 'useDestinations').mockImplementation(() => ({
    getDestinationById: mockGetDestinationById,
  }));
});

describe('Destination Component loaded', () => {
  test('renders Destination details after data fetch', async () => {
    render(
      <BrowserRouter>
        <Destination />
      </BrowserRouter>
    );


    await waitFor(() => expect(screen.getByText('Eiffel Tower')).toBeInTheDocument());
  });
});
