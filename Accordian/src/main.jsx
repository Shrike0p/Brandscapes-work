import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './pages/Approutes';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes/>
  </React.StrictMode>
);
