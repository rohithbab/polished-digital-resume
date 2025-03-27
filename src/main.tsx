import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { debug } from './utils/debug'

// Add error boundary for the root
window.onerror = (message, source, lineno, colno, error) => {
  debug.error('Global error:', {
    message,
    source,
    lineno,
    colno,
    error: error?.toString()
  });
};

// Add unhandled rejection handler
window.onunhandledrejection = (event) => {
  debug.error('Unhandled promise rejection:', {
    reason: event.reason
  });
};

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  debug.error('Failed to render app:', error);
  // Show a fallback UI if rendering fails
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: red;">
        <h1>Something went wrong</h1>
        <p>Please try refreshing the page</p>
        <button onclick="window.location.reload()">Refresh Page</button>
      </div>
    `;
  }
}
