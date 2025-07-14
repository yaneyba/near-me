import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { QueryProvider } from '@/providers/QueryProvider';
import './index.css';

// Force cache busting
const timestamp = Date.now();
console.log(`App loaded at: ${new Date(timestamp).toISOString()}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);