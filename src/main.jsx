import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { CursorProvider } from './contextAPI/Cursorcontext.jsx'
import { StockProvider } from './contextAPI/Stockcontext.jsx'
import { AuthProvider } from './contextAPI/Authcontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <StockProvider>
        <CursorProvider>
          <App />
        </CursorProvider>
      </StockProvider>
    </AuthProvider>
  </StrictMode>
)