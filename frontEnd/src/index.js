import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

export function getIP() {
  // Set the ip to be the host of the database
  // const ip = 'localhost';
  const ip = '192.168.1.15';
  return ip;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
