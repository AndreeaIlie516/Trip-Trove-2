import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { DestinationGrid } from '../components/DestinationGrid';
import userEvent from '@testing-library/user-event';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

  
jest.mock('../contexts/DestinationContext', () => ({
    useDestinations: () => ({
      destinations: [
        { id: "1", name: 'Place A', location: 'Location A', country: 'Country A', visitors_last_year: 100, image_url: 'http://example.com/image_a.jpg' },
        { id: "2", name: 'Place B', location: 'Location B', country: 'Country B', visitors_last_year: 200, image_url: 'http://example.com/image_b.jpg' },
        { id: "3", name: 'Place C', location: 'Location C', country: 'Country C', visitors_last_year: 200, image_url: 'http://example.com/image_b.jpg' },
        { id: "4", name: 'Place D', location: 'Location D', country: 'Country D', visitors_last_year: 200, image_url: 'http://example.com/image_b.jpg' },
        { id: "5", name: 'Place E', location: 'Location E', country: 'Country E', visitors_last_year: 200, image_url: 'http://example.com/image_b.jpg' },
        { id: "6", name: 'Place F', location: 'Location F', country: 'Country F', visitors_last_year: 200, image_url: 'http://example.com/image_b.jpg' },
        { id: "7", name: 'Place G', location: 'Location G', country: 'Country G', visitors_last_year: 200, image_url: 'http://example.com/image_b.jpg' },

      ],
      deleteDestination: jest.fn(),
    }),
  }));
  

describe('All destinations', () => {
    test('renders DestinationGrid component', () => {
        render(<DestinationGrid />, { wrapper: BrowserRouter });
        expect(screen.getByText('Add New Destination')).toBeInTheDocument();
      });

    test('renders DestinationGrid headers', () => {
        render(<DestinationGrid />, { wrapper: BrowserRouter });
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();
        expect(screen.getByText('Visitors last year')).toBeInTheDocument();
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    test('changes page when pagination is clicked', async () => {
        render(<DestinationGrid />, { wrapper: BrowserRouter });
        const paginationButton = await screen.findByText('2');
        userEvent.click(paginationButton);
        expect(screen.getByText('Place A')).toBeInTheDocument(); 
    });
    test('opens dialog and confirms destination deletion', async () => {
        render(<DestinationGrid />, { wrapper: BrowserRouter });
        const deleteButton = screen.getAllByText('Delete')[0];
        userEvent.click(deleteButton);
      
        const dialogTitle = await screen.findByText('Are you sure you want to delete this destination?');
        expect(dialogTitle).toBeInTheDocument();
    
      });
});
