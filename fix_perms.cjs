const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// The default permissions string
const defaultPerms = `permissions: { ...DEFAULT_PERMISSIONS }`;

// We want to replace it for dir_acc_1
const dir1Search = `{ id: 'dir_acc_1', name: 'د. عماد محمد عبد الله', role: 'director', title: 'مدير عام صحة نينوى', email: 'director@ninveh.health.gov.iq', phone: '07700000000', username: 'emad_dg', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS } }`;
const dir1Replace = `{ id: 'dir_acc_1', name: 'د. عماد محمد عبد الله', role: 'director', title: 'مدير عام صحة نينوى', email: 'director@ninveh.health.gov.iq', phone: '07700000000', username: 'emad_dg', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showPublicEvalsPage: true, showDeliveryPage: true } }`;

// For dir_acc_2
const dir2Search = `{ id: 'dir_acc_2', name: 'دكتورة ابتهال غازي', role: 'central_director', title: 'مدير الرقابة المركزية', email: 'central_director@ninveh.health.gov.iq', phone: '07711223344', username: 'central_dir', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS } }`;
const dir2Replace = `{ id: 'dir_acc_2', name: 'دكتورة ابتهال غازي', role: 'central_director', title: 'مدير الرقابة المركزية', email: 'central_director@ninveh.health.gov.iq', phone: '07711223344', username: 'central_dir', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showDirectivesPage: true, sendDirective: true, showDeliveryPage: true, manageEstablishments: true } }`;

content = content.replace(dir1Search, dir1Replace);
content = content.replace(dir2Search, dir2Replace);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('Fixed initial permissions in AppContext.jsx');
