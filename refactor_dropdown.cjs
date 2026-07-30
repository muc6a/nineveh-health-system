const fs = require('fs');

let content = fs.readFileSync('src/pages/ExecutivePortal.jsx', 'utf8');

// 1. Refactor the select dropdown
const selectSearch = `<select 
            value={executiveTab}
            onChange={(e) => setExecutiveTab(e.target.value)}
            className="w-full md:w-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 font-bold text-xs"
          >
            {hasPerm('showMainDashboard') && (
              <option value="all">📊 الملخص الإحصائي العام للمحافظة</option>
            )}
            <option value="establishments">🏢 إدارة المنشآت</option>
            {hasPerm('showReportsPage') && !isDirectorGeneral && allowedTeams.map(t => (
              <option key={t.id} value={t.id}>👥 {t.name}</option>
            ))}
          </select>`;

const selectReplace = `<select 
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full md:w-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 font-bold text-xs"
          >
            <option value="all">🌍 نطاق البيانات: عموم محافظة نينوى</option>
            {hasPerm('showReportsPage') && !isDirectorGeneral && allowedTeams.map(t => (
              <option key={t.id} value={t.id}>👥 فلترة البيانات: {t.name}</option>
            ))}
          </select>`;

if (content.includes("value={executiveTab}")) {
    content = content.replace(selectSearch, selectReplace);
}

// 2. Change Welcome Header text logic (remove executiveTab)
const headerSearch = `{executiveTab === 'establishments' ? 'إدارة المنشآت والـ QR' : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : \`إحصائيات \${allowedTeams.find(t => t.id === selectedTeamId)?.name}\`)}`;
const headerReplace = `{activeTab === 'establishments' ? 'إدارة المنشآت والـ QR' : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : \`إحصائيات \${allowedTeams.find(t => t.id === selectedTeamId)?.name}\`)}`;
if (content.includes("executiveTab === 'establishments' ?")) {
    content = content.replace(headerSearch, headerReplace);
}

const descSearch = `{executiveTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة'}`;
const descReplace = `{activeTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة'}`;
if (content.includes("executiveTab === 'establishments' ?")) {
    content = content.replace(descSearch, descReplace);
}

// 3. Add Establishments Tab button
const tabsContainerSearch = `<div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">`;
const tabsContainerReplace = `<div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          {hasPerm('manageEstablishments') && (
            <button
              onClick={() => setActiveTab('establishments')}
              className={\`px-4 py-2 rounded-xl text-xs font-bold transition-all \${
                activeTab === 'establishments'
                  ? 'bg-teal-600 text-white font-black'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }\`}
            >
              🏢 إدارة المنشآت وقاعدة البيانات
            </button>
          )}`;

if (!content.includes("🏢 إدارة المنشآت وقاعدة البيانات")) {
    content = content.replace(tabsContainerSearch, tabsContainerReplace);
}

// 4. Change Content Rendering Logic
const renderSearch = `{/* Tab Content Rendering */}
        {executiveTab === 'establishments' ? (
          <EstablishmentsManager />
        ) : (
          <>`;
const renderReplace = `{/* Tab Content Rendering */}
        {activeTab === 'establishments' ? (
          <EstablishmentsManager />
        ) : (
          <>`;

if (content.includes("executiveTab === 'establishments' ?")) {
    content = content.replace(renderSearch, renderReplace);
}

// 5. Change default initial tab
const initTabSearch = `if (hasPerm('showMainDashboard')) return 'strategic';`;
const initTabReplace = `if (hasPerm('showMainDashboard')) return 'strategic';
    if (hasPerm('manageEstablishments')) return 'establishments';`;
if (!content.includes("return 'establishments'")) {
    content = content.replace(initTabSearch, initTabReplace);
}

fs.writeFileSync('src/pages/ExecutivePortal.jsx', content);
console.log('Refactored dropdown and added establishments tab');
