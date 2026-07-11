import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppContext } from './src/context/AppContext.jsx';
import { SuperAdminPanel } from './src/pages/SuperAdminPanel.jsx';

const mockContext = {
  navigate: () => {},
  teams: [], setTeams: () => {},
  inspectionItems: [], setInspectionItems: () => {},
  config: { headerText: '', allowImageUpload: true, allowExternalReports: true, imageRetention: '', uiScale: '' }, setConfig: () => {},
  user: { role: 'admin', name: 'admin' }, setUser: () => {},
  directors: [], setDirectors: () => {},
  setEstablishments: () => {}, setReports: () => {}, setDirectives: () => {},
  establishments: [], reports: [], directives: [],
  tickets: [], setTickets: () => {},
  auditLogs: [], publicCMS: { heroTitle: '', heroSubtext: '', announcement: '' }, setPublicCMS: () => {}
};

try {
  renderToString(
    <AppContext.Provider value={mockContext}>
      <SuperAdminPanel />
    </AppContext.Provider>
  );
  console.log("RENDER SUCCESS");
} catch(e) {
  console.log("RENDER FAILED:", e.message);
  console.log(e.stack);
}
