import { StrictMode } from 'react' // eslint-disable-line
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'
import { AccentProvider } from './context/AccentContext'
import './i18n/config'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AccentProvider>
        <App />
      </AccentProvider>
    </ThemeProvider>
  </StrictMode>,
)
