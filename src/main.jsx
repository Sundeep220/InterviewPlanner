import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TrackingProvider } from './hooks/useTracking.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TrackingProvider>
      <App />
    </TrackingProvider>
  </React.StrictMode>,
)
