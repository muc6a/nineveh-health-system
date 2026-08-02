const fs = require('fs');
let code = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Rename 'settings' tab button to 'database_settings' and change its label
code = code.replace(
  "onClick={() => setActiveTab('settings')}",
  "onClick={() => setActiveTab('database_settings')}"
);
code = code.replace(
  "activeTab === 'settings'",
  "activeTab === 'database_settings'"
);
code = code.replace(
  "<span>الضبط والإعدادات العامة</span>",
  "<span>إدارة قواعد البيانات والتخزين</span>"
);

// 2. Add the new 'general_settings' tab button before it
const newTabButton = `
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('general_settings')}
            className={\`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer \${
              activeTab === 'general_settings'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }\`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>الضبط والإعدادات العامة</span>
          </button>
        )}
`;
code = code.replace(
  "{user?.role === 'admin' && (\n          <button\n            onClick={() => setActiveTab('database_settings')}",
  newTabButton + "\n        {user?.role === 'admin' && (\n          <button\n            onClick={() => setActiveTab('database_settings')}"
);
code = code.replace(
  '<Settings className="w-4.5 h-4.5" />\n            <span>إدارة قواعد البيانات والتخزين</span>',
  '<Database className="w-4.5 h-4.5" />\n            <span>إدارة قواعد البيانات والتخزين</span>'
);

// 3. Rename the rendering condition for settings
code = code.replace(
  "activeTab === 'settings' && user?.role === 'admin' ? (",
  "activeTab === 'database_settings' && user?.role === 'admin' ? ("
);
code = code.replace(
  "النسخ الاحتياطي وإدارة بيانات النظام",
  "النسخ الاحتياطي وإدارة التخزين"
);

// 4. Extract the Branding Header Input
const headerInputSectionRegex = /<div className="space-y-1\.5">[\s\S]*?<label className="text-xs font-bold text-slate-500 block">عنوان الترويسة الرئيسي للواجهات<\/label>[\s\S]*?<\/div>/;
const headerInputMatch = code.match(headerInputSectionRegex);

if (headerInputMatch) {
  // Remove it from database settings
  code = code.replace(headerInputMatch[0], "");
  
  // Create the new general_settings tab content
  const newTabContent = `
        ) : activeTab === 'general_settings' && user?.role === 'admin' ? (
          <div className="animate-fade-in-up space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-right">
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                <Settings className="w-5 h-5 text-teal-600" />
                <span>هوية المنظومة والواجهات (System Branding)</span>
              </h2>
              
              <div className="max-w-xl">
                \${headerInputMatch[0]}
                <p className="text-[10px] text-slate-400 mt-2">
                  هذا هو العنوان الرئيسي الذي سيظهر في أعلى الشاشة في بوابة المالك والمواطن وبعض الواجهات الرئيسية للنظام.
                </p>
                
                <button
                  onClick={saveZeroCodeConfig}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer"
                >
                  حفظ وتطبيق التغييرات
                </button>
              </div>
            </div>
          </div>
`;
  code = code.replace(
    ") : activeTab === 'establishments' ? (",
    newTabContent + "\n        ) : activeTab === 'establishments' ? ("
  );
}

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', code);
console.log('Successfully refactored settings tab');
