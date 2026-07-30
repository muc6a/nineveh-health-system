const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

const endOfChainSearch = `        ) : null}`;

const newPlaceholders = `        ) : activeTab === 'directives' && hasPerm('showDirectivesPage') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Mail className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">صندوق المراسلات والبلاغات</h2>
            <p className="text-xs text-slate-500 max-w-sm">هذه الصفحة قيد التطوير وسيتم تفعيلها قريباً لاستقبال أوامر وتوجيهات الإدارة العليا والتبليغات.</p>
          </div>
        ) : activeTab === 'delivery' && hasPerm('showDeliveryPage') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Package className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">إدارة خدمة التوصيل</h2>
            <p className="text-xs text-slate-500 max-w-sm">قريباً سيتم إدارة عمال التوصيل والمناديب المتعاقدين مع المنشآت وتدقيق هوياتهم الصحية من هنا.</p>
          </div>
        ) : activeTab === 'public_evals' && hasPerm('showPublicEvalsPage') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckSquare className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">التقييمات العامة (المواطنين)</h2>
            <p className="text-xs text-slate-500 max-w-sm">سيتم عرض تقييمات وبلاغات المواطنين الواردة عبر مسح الـ QR الخاص بالمنشآت لمتابعتها.</p>
          </div>
        ) : activeTab === 'accounts' && hasPerm('manageAccounts') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Users className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">إدارة الحسابات والصلاحيات</h2>
            <p className="text-xs text-slate-500 max-w-sm">هذه الصفحة ستسمح لك بإنشاء وتعديل صلاحيات حسابات النظام وإدارة الفرق الميدانية.</p>
          </div>
        ) : activeTab === 'settings' && hasPerm('manageSettings') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Settings className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">إعدادات المنظومة</h2>
            <p className="text-xs text-slate-500 max-w-sm">صفحة مخصصة للتحكم بالهوية البصرية، النصوص الافتراضية، ودرجات النجاح والرسوب.</p>
          </div>
        ) : activeTab === 'audit' && hasPerm('viewAuditLogs') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">سجل المراقبة والتدقيق</h2>
            <p className="text-xs text-slate-500 max-w-sm">سجل شامل يعرض كافة الحركات التي تمت في النظام لضمان النزاهة والموثوقية.</p>
          </div>
        ) : activeTab === 'backup' && hasPerm('backupData') ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Database className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">النسخ الاحتياطي للبيانات</h2>
            <p className="text-xs text-slate-500 max-w-sm">يمكنك من هنا تحميل وتأمين نسخة احتياطية من جميع بيانات المنظومة محلياً.</p>
          </div>
        ) : null}`;

if (content.includes(endOfChainSearch)) {
    content = content.replace(endOfChainSearch, newPlaceholders);
    fs.writeFileSync('src/pages/ExecutivePortal.jsx', content);
    console.log('Fixed placeholders in IF-ELSE chain');
} else {
    console.log('Could not find end of chain marker');
}
