import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import '@tremor/react/dist/esm/tremor.css';

// Vite supports the modern `createRoot` API for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  
    <App />
);

// Optional: if reportWebVitals is used, uncomment and import it
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(console.log);
