import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getBackendUrl, getRealBackendUrl } from './utils/config.ts'

// 设置全局后端地址（先使用relay URL作为初始值）
window.BACKEND_URL = getBackendUrl();

// 异步获取真实后端URL并更新
getRealBackendUrl().then((realUrl) => {
  window.BACKEND_URL = realUrl;
}).catch(() => {
  // 如果获取失败，保持relay URL作为备用
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
