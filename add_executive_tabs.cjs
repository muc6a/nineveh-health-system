const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

// 1. Add missing icon imports
const importSearch = `import { LogOut, MapPin, AlertTriangle, X, CheckCircle, TrendingUp, Users, ShieldAlert, FileText, Send, Building, LayoutDashboard, Camera } from 'lucide-react';`;
const importReplace = `import { LogOut, MapPin, AlertTriangle, X, CheckCircle, TrendingUp, Users, ShieldAlert, FileText, Send, Building, LayoutDashboard, Camera, Mail, Package, CheckSquare } from 'lucide-react';`;
if (content.includes(importSearch)) {
    content = content.replace(importSearch, importReplace);
} else {
    // If exact import is different, try regex
    content = content.replace(/import \{.*?\} from 'lucide-react';/, match => {
        if (!match.includes('Mail')) {
            return match.replace('}', ', Mail, Package, CheckSquare }');
        }
        return match;
    });
}

// 2. Add sub-tabs buttons
const tabsSearch = `{hasPerm('showReportsPage') && (
            <button
              onClick={() => setActiveTab('geographic')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'geographic'
                  ? 'bg-teal-600 text-white font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🗺️ خارطة الكثافة والتوزيع الجغرافي
            </button>
          )}`;

const tabsReplace = `{hasPerm('showReportsPage') && (
            <button
              onClick={() => setActiveTab('geographic')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'geographic'
                  ? 'bg-teal-600 text-white font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🗺️ خارطة الكثافة والتوزيع الجغرافي
            </button>
          )}

          {hasPerm('showDirectivesPage') && (
            <button
              onClick={() => setActiveTab('directives')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'directives' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              📨 صندوق المراسلات والبلاغات
            </button>
          )}

          {hasPerm('showDeliveryPage') && (
            <button
              onClick={() => setActiveTab('delivery')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'delivery' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              📦 خدمة التوصيل
            </button>
          )}

          {hasPerm('showPublicEvalsPage') && (
            <button
              onClick={() => setActiveTab('public_evals')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'public_evals' ? 'bg-teal-600 text-white font-black' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🗣️ تقييمات وشكاوى المواطنين
            </button>
          )}`;

if (content.includes("🗺️ خارطة الكثافة والتوزيع الجغرافي")) {
    content = content.replace(tabsSearch, tabsReplace);
}

// 3. Add placeholders right before the ending `</>` of the non-establishments render flow.
// Actually, it's easier to add it after the `geographic` tab render block or right before `</>` of the `executiveTab !== 'establishments'`
// Wait, `ExecutivePortal.jsx` has `activeTab === 'strategic'` and `activeTab === 'geographic'`.
// Let's find `activeTab === 'geographic'` block:
const geoRenderSearch = `{activeTab === 'geographic' && hasPerm('showReportsPage') && (
          <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 backdrop-blur-md rounded-[2rem] p-4 h-[600px] shadow-[0_0_50px_-12px_rgba(168,85,247,0.1)] mb-8">
            <NinevehMap teams={teams} allowedTeams={allowedTeams} />
          </div>
        )}`;

const geoRenderReplace = `{activeTab === 'geographic' && hasPerm('showReportsPage') && (
          <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 backdrop-blur-md rounded-[2rem] p-4 h-[600px] shadow-[0_0_50px_-12px_rgba(168,85,247,0.1)] mb-8">
            <NinevehMap teams={teams} allowedTeams={allowedTeams} />
          </div>
        )}

        {activeTab === 'directives' && hasPerm('showDirectivesPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Mail className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">صندوق المراسلات والبلاغات</h2>
            <p className="text-xs text-slate-500 max-w-sm">هذه الصفحة قيد التطوير وسيتم تفعيلها قريباً لاستقبال أوامر وتوجيهات الإدارة العليا والتبليغات.</p>
          </div>
        )}

        {activeTab === 'delivery' && hasPerm('showDeliveryPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Package className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">إدارة خدمة التوصيل</h2>
            <p className="text-xs text-slate-500 max-w-sm">قريباً سيتم إدارة عمال التوصيل والمناديب المتعاقدين مع المنشآت وتدقيق هوياتهم الصحية من هنا.</p>
          </div>
        )}

        {activeTab === 'public_evals' && hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <CheckSquare className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">التقييمات العامة (المواطنين)</h2>
            <p className="text-xs text-slate-500 max-w-sm">سيتم عرض تقييمات وبلاغات المواطنين الواردة عبر مسح الـ QR الخاص بالمنشآت لمتابعتها.</p>
          </div>
        )}`;

if (content.includes("activeTab === 'geographic' && hasPerm('showReportsPage')")) {
    content = content.replace(geoRenderSearch, geoRenderReplace);
}

fs.writeFileSync('src/pages/ExecutivePortal.jsx', content);
console.log('Added missing tabs to ExecutivePortal');
