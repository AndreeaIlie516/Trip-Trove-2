import React from 'react'
import ReactDOM from 'react-dom/client'
import RoutesProvider from './router/router'
import { DestinationProvider } from './contexts/DestinationContext'

ReactDOM.createRoot(
  document.getElementById('root')!).render(
    <React.StrictMode>
      <DestinationProvider>
          <RoutesProvider />
      </DestinationProvider>
    </React.StrictMode>,
  )