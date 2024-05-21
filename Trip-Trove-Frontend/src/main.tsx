import React from 'react'
import ReactDOM from 'react-dom/client'
import RoutesProvider from './router/router'
import { DestinationProvider } from './contexts/DestinationContext'
import { LocationProvider } from './contexts/LocationContext'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DestinationProvider>
        <LocationProvider>
          <RoutesProvider />
        </LocationProvider>
      </DestinationProvider>
    </AuthProvider>
  </React.StrictMode>,
)