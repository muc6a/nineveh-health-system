const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

const getInitialSearch = `  const getInitialExecutiveTab = () => {
    if (user?.role === 'central_director') return 'operations_room';
    if (hasPerm('showMainDashboard')) return 'strategic';
    if (hasPerm('showReportsPage')) return 'geographic';
    return null;
  };`;

const getInitialReplace = `  const getInitialExecutiveTab = () => {
    if (user?.role === 'central_director') return 'operations_room';
    if (hasPerm('showMainDashboard')) return 'strategic';
    if (hasPerm('showReportsPage')) return 'geographic';
    if (hasPerm('showDirectivesPage')) return 'directives';
    if (hasPerm('showDeliveryPage')) return 'delivery';
    if (hasPerm('showPublicEvalsPage')) return 'public_evals';
    return null;
  };`;

if (content.includes("if (hasPerm('showMainDashboard')) return 'strategic';")) {
    content = content.replace(getInitialSearch, getInitialReplace);
    fs.writeFileSync('src/pages/ExecutivePortal.jsx', content);
    console.log('Updated getInitialExecutiveTab');
}
