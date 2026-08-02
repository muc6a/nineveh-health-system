const fs = require('fs');

// 1. AccountModal
let accountModal = fs.readFileSync('src/components/AccountModal.jsx', 'utf8');
if (!accountModal.includes('sendDirectives:')) {
    accountModal = accountModal.replace(
        "showDirectivesPage: true,",
        "showDirectivesPage: true,\n    sendDirectives: true,"
    );
    accountModal = accountModal.replace(
        "{ id: 'showDirectivesPage', label: 'صندوق التوجيهات' },",
        "{ id: 'showDirectivesPage', label: 'صندوق التوجيهات' },\n    { id: 'sendDirectives', label: 'إرسال التوجيهات للفرق' },"
    );
    fs.writeFileSync('src/components/AccountModal.jsx', accountModal);
    console.log('AccountModal updated');
}

// 2. SuperAdminPanel
let superAdmin = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');
if (!superAdmin.includes('sendDirectives:')) {
    superAdmin = superAdmin.replace(
        "showDirectivesPage: { title: 'صندوق التوجيهات', desc: 'استلام ومتابعة التوجيهات الواردة من الجهات العليا' },",
        "showDirectivesPage: { title: 'صندوق التوجيهات', desc: 'استلام ومتابعة التوجيهات الواردة من الجهات العليا' },\n  sendDirectives: { title: 'إرسال التوجيهات للفرق', desc: 'يسمح للمدير بتوجيه أوامر مباشرة للجان الميدانية' },"
    );
    fs.writeFileSync('src/pages/SuperAdminPanel.jsx', superAdmin);
    console.log('SuperAdminPanel updated');
}

// 3. ExecutivePortal
let executivePortal = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');
if (!executivePortal.includes('hasPerm(\'sendDirectives\')')) {
    executivePortal = executivePortal.replace(
        "if (user.role === 'super_admin') {",
        "if (user.role === 'super_admin' || hasPerm('sendDirectives')) {"
    );
    fs.writeFileSync('src/pages/ExecutivePortal.jsx', executivePortal);
    console.log('ExecutivePortal updated');
}
