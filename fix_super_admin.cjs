const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Sidebar Main Tabs Rename
content = content.replace(
  '<span>👥 إدارة حسابات اللجان الميدانية</span>',
  '<span>👥 إدارة الحسابات</span>'
);

content = content.replace(
  '<span>⚙️ الصفحات</span>',
  '<span>⚙️ إعدادات النظام</span>'
);

content = content.replace(
  '<span>🛡️ تعديلات</span>',
  '<span>🛡️ سجل التدقيق والمراقبة الأمنية</span>'
);

// 2. Remove "كفاءة الفرق" from SuperAdminPanel
content = content.replace(
  `            <button
              onClick={() => setActiveTab('analytics')}
              className={\`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer \${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }\`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>📊 كفاءة الفرق</span>
            </button>`,
  ''
);

// 3. Remove Notification Bell
content = content.replace(
  /<NotificationBell \/>/,
  ''
);

// 4. Update Accounts Subtabs to show Total, Active, Frozen
content = content.replace(
  '👥 إدارة حسابات اللجان الميدانية ({teams.length})',
  '👥 اللجان الميدانية (الكلي: {teams.length} | نشط: {teams.filter(t => t.status !== "frozen").length} | مجمد: {teams.filter(t => t.status === "frozen").length})'
);

content = content.replace(
  '💼 إدارة حسابات المدراء ({directors?.length || 0})',
  '👑 المدراء والقيادات (الكلي: {directors?.length || 0} | نشط: {directors?.filter(d => d.status !== "frozen").length || 0} | مجمد: {directors?.filter(d => d.status === "frozen").length || 0})'
);

// Note: For trackers, the text might be different. Let's find it.
// "🕵️‍♂️ إدارة حسابات المتابعين ({trackers?.length || 0})"
content = content.replace(
  /🕵️‍♂️ إدارة حسابات المتابعين \(\{trackers\?\.length \|\| 0\}\)/g,
  '🕵️‍♂️ المتابعين السريين (الكلي: {trackers?.length || 0} | نشط: {trackers?.filter(t => t.status !== "frozen").length || 0} | مجمد: {trackers?.filter(t => t.status === "frozen").length || 0})'
);


fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('SuperAdminPanel modified.');
