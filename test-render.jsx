import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppProvider } from './src/context/AppContext.jsx';
import { SuperAdminPanel } from './src/pages/SuperAdminPanel.jsx';

try {
  renderToString(<AppProvider><SuperAdminPanel /></AppProvider>);
  console.log("RENDER SUCCESS");
} catch (e) {
  console.error("RENDER ERROR:", e);
}
