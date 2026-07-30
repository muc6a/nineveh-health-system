const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

const getInitialSearch = `    if (hasPerm('showPublicEvalsPage')) return 'public_evals';
    return null;`;

const getInitialReplace = `    if (hasPerm('showPublicEvalsPage')) return 'public_evals';
    if (hasPerm('manageAccounts')) return 'accounts';
    if (hasPerm('manageSettings')) return 'settings';
    if (hasPerm('viewAuditLogs')) return 'audit';
    if (hasPerm('backupData')) return 'backup';
    return null;`;

if (!content.includes("return 'accounts'")) {
    content = content.replace(getInitialSearch, getInitialReplace);
}

const tabsSearch = `{hasPerm('showPublicEvalsPage') && (
            <button
              onClick={() => setActiveTab('public_evals')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'public_evals' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🗣️ تقييمات وشكاوى المواطنين
            </button>
          )}`;

const tabsReplace = `{hasPerm('showPublicEvalsPage') && (
            <button
              onClick={() => setActiveTab('public_evals')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'public_evals' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🗣️ تقييمات وشكاوى المواطنين
            </button>
          )}

          {hasPerm('manageAccounts') && (
            <button
              onClick={() => setActiveTab('accounts')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'accounts' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              👥 إدارة الحسابات
            </button>
          )}

          {hasPerm('manageSettings') && (
            <button
              onClick={() => setActiveTab('settings')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'settings' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              ⚙️ إعدادات المنظومة
            </button>
          )}

          {hasPerm('viewAuditLogs') && (
            <button
              onClick={() => setActiveTab('audit')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'audit' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🛡️ سجل المراقبة
            </button>
          )}

          {hasPerm('backupData') && (
            <button
              onClick={() => setActiveTab('backup')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'backup' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              💾 النسخ الاحتياطي
            </button>
          )}`;

if (!content.includes("إدارة الحسابات")) {
    content = content.replace(tabsSearch, tabsReplace);
}

const renderSearch = `{activeTab === 'public_evals' && hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckSquare className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">التقييمات العامة (المواطنين)</h2>
            <p className="text-xs text-slate-500 max-w-sm">سيتم عرض تقييمات وبلاغات المواطنين الواردة عبر مسح الـ QR الخاص بالمنشآت لمتابعتها.</p>
          </div>
        )}`;

const renderReplace = `{activeTab === 'public_evals' && hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckSquare className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">التقييمات العامة (المواطنين)</h2>
            <p className="text-xs text-slate-500 max-w-sm">سيتم عرض تقييمات وبلاغات المواطنين الواردة عبر مسح الـ QR الخاص بالمنشآت لمتابعتها.</p>
          </div>
        )}

        {activeTab === 'accounts' && hasPerm('manageAccounts') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Users className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">إدارة الحسابات والصلاحيات</h2>
            <p className="text-xs text-slate-500 max-w-sm">هذه الصفحة ستسمح لك بإنشاء وتعديل صلاحيات حسابات النظام وإدارة الفرق الميدانية.</p>
          </div>
        )}

        {activeTab === 'settings' && hasPerm('manageSettings') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Settings className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">إعدادات المنظومة</h2>
            <p className="text-xs text-slate-500 max-w-sm">صفحة مخصصة للتحكم بالهوية البصرية، النصوص الافتراضية، ودرجات النجاح والرسوب.</p>
          </div>
        )}

        {activeTab === 'audit' && hasPerm('viewAuditLogs') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">سجل المراقبة والتدقيق</h2>
            <p className="text-xs text-slate-500 max-w-sm">سجل شامل يعرض كافة الحركات التي تمت في النظام لضمان النزاهة والموثوقية.</p>
          </div>
        )}

        {activeTab === 'backup' && hasPerm('backupData') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Database className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">النسخ الاحتياطي للبيانات</h2>
            <p className="text-xs text-slate-500 max-w-sm">يمكنك من هنا تحميل وتأمين نسخة احتياطية من جميع بيانات المنظومة محلياً.</p>
          </div>
        )}`;

if (!content.includes("إدارة الحسابات والصلاحيات")) {
    content = content.replace(renderSearch, renderReplace);
}

// Add imports for Database and Settings if missing
if (!content.includes('Settings')) {
    content = content.replace('LogOut,', 'LogOut, Settings, Database,');
}

fs.writeFileSync('src/pages/ExecutivePortal.jsx', content);
console.log('Added missing advanced tabs to ExecutivePortal');
