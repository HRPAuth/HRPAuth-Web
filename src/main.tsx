import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// TypeScript doesn't need type info for global CSS imports; ignore the next line
// @ts-expect-error CSS imports don't need type definitions
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
