import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("main.jsx is executing...");

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log("Root element found, rendering...");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element NOT found!");
}
