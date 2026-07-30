const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

const oldDestructuring = `const { navigate, teams, setTeams, trackers, setTrackers, inspectionItems, setInspectionItems, config, setConfig, user, setUser, directors, setDirectors, setEstablishments, setReports, setDirectives, establishments, reports, directives, tickets, setTickets, auditLogs, publicCMS, setPublicCMS, notify, globalBroadcast, setGlobalBroadcast } = useContext(AppContext);`;

const newDestructuring = `const { navigate, teams, setTeams, trackers, setTrackers, inspectionItems, setInspectionItems, config, setConfig, user, setUser, directors, setDirectors, setEstablishments, setReports, setDirectives, establishments, reports, directives, tickets, setTickets, auditLogs, publicCMS, setPublicCMS, notify, globalBroadcast, setGlobalBroadcast, uiPreferences, setUiPreferences } = useContext(AppContext);`;

content = content.replace(oldDestructuring, newDestructuring);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Destructuring fixed.');
