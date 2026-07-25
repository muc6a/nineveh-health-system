const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// Fix Tab 1
content = content.replace(
  /<span>👥 إدارة الحسابات<\/span>/,
  '<span>إدارة الحسابات والصلاحيات</span>'
);

// Fix Tab 2
content = content.replace(
  /<span>⚙️ إعدادات النظام<\/span>/,
  '<span>الضبط والإعدادات العامة</span>'
);

// Fix Tab 3
content = content.replace(
  /<span>🍽️ إدارة المنشأة<\/span>/,
  '<span>قاعدة بيانات المنشآت</span>'
);

// Fix Tab 4
content = content.replace(
  /<span>🛡️ سجل التدقيق والمراقبة الأمنية<\/span>/,
  '<span>سجل المراقبة والتدقيق</span>'
);

// Fix Tab 5
content = content.replace(
  /<span>📢 البث العاجل<\/span>/,
  '<span>نظام التعميم والبث العاجل</span>'
);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('SuperAdminPanel tab names fixed.');
