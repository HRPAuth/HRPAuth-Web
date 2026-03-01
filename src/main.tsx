import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// TypeScript doesn't need type info for global CSS imports; ignore the next line
// @ts-expect-error CSS imports don't need type definitions
import './index.css'
import App from './App.tsx'
import { getBackendUrl } from './utils/config.ts'

// 设置全局后端地址
window.BACKEND_URL = getBackendUrl();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
