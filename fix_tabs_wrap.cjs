const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

const searchTabContainer = `<div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap">`;
const replaceTabContainer = `<div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 flex-wrap">`;

if (content.includes(searchTabContainer)) {
    content = content.replace(searchTabContainer, replaceTabContainer);
    fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
    console.log('Fixed tabs container to flex-wrap');
} else {
    console.log('Could not find exact string.');
}
