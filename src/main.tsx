import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import './index.css';

// Force cache busting
const timestamp = Date.now();
console.log(`App loaded at: ${new Date(timestamp).toISOString()}`);

// Add error handling for React app
try {
  console.log('🚀 Starting React app...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('❌ Root element not found!');
    document.body.innerHTML = '<div style="padding: 20px; color: red;">Error: Root element not found</div>';
  } else {
    console.log('✅ Root element found, creating React root...');
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ React app rendered successfully');
  }
} catch (error) {
  console.error('❌ Error starting React app:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  document.body.innerHTML = `<div style="padding: 20px; color: red;">Error starting React app: ${errorMessage}</div>`;
}