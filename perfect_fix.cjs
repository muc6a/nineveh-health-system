const fs = require('fs');
let file = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Remove all old grantedPerms logic
file = file.replace(/^\s*const totalPerms = Object\.keys\(DEFAULT_PERMISSIONS\)\.length;\s*\n/gm, '');
file = file.replace(/^\s*const grantedPerms = .*\n/gm, '');
file = file.replace(/^\s*const progressPercentage = .*\n/gm, '');

// 2. Add grantedPerms logic globally
const globalVars = `
  const totalPerms = Object.keys(DEFAULT_PERMISSIONS || {}).length;
  const grantedPerms = selectedPermissionsAccount?.permissions ? Object.keys(DEFAULT_PERMISSIONS || {}).filter(k => selectedPermissionsAccount.permissions?.[k]).length : 0;
  const progressPercentage = totalPerms ? Math.round((grantedPerms / totalPerms) * 100) : 0;
`;
// Insert after setSelectedPermissionsAccount
file = file.replace('const [selectedPermissionsAccount, setSelectedPermissionsAccount] = useState(null);', 'const [selectedPermissionsAccount, setSelectedPermissionsAccount] = useState(null);\n' + globalVars);

// 3. Move 'evaluations' and 'fines_booklet' to activeTab === 'activities_fines'
const evalStart = '{subSettingsTab === "evaluations" && (';
const evalIdx = file.indexOf(evalStart);
const nextSectionIdx = file.indexOf("        {activeTab === 'permissions' && (");

if (evalIdx > -1 && nextSectionIdx > evalIdx) {
  const blocks = file.substring(evalIdx, nextSectionIdx);
  // Remove from original place
  file = file.slice(0, evalIdx) + file.slice(nextSectionIdx);
  
  // Make them unconditionally displayed inside activities_fines
  let cleanBlocks = blocks.replace(/\{subSettingsTab === "evaluations" && \(\s*<section/g, '<section');
  cleanBlocks = cleanBlocks.replace(/\{subSettingsTab === "fines_booklet" && \(\s*<section/g, '<section');
  cleanBlocks = cleanBlocks.replace(/<\/section>\s*\)\}/g, '</section>');
  
  const activitiesSection = `
        {activeTab === 'activities_fines' && (
          <div className="grid grid-cols-1 gap-8 animate-fade-in-up">
            ${cleanBlocks}
          </div>
        )}
  `;
  file = file.replace("{activeTab === 'permissions' && (", activitiesSection + "\n        {activeTab === 'permissions' && (");
}

// 4. Fix top navigation bar CSS
const oldNav = 'className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap"';
const newNav = 'className="flex flex-wrap items-center gap-2 md:gap-3 pb-4 sticky top-0 z-[999] bg-slatebg-light dark:bg-slatebg-dark pt-2 -mt-2 mb-2"';
file = file.replace(oldNav, newNav);

// Reset font sizes of tabs
file = file.replace(/px-4 py-2\.5 rounded-2xl text-xs font-black/g, 'px-4 py-2.5 rounded-2xl text-sm md:text-base font-black');

// 5. Fix duplicated title in general_settings
const dupTitle = `<h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Settings className="w-5 h-5 text-teal-600" />
              <span>هوية المنظومة والبوابات</span>
            </h2>`;
file = file.replace(dupTitle, '');

// 6. Add text to permissions center
const permTitle = `<h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <span>مركز الصلاحيات السيادي (Role-Based Access Control)</span>
            </h2>`;
const permTitleNew = permTitle + `\n            <p className="text-sm text-slate-500 mb-6 text-right font-medium">من خلال هذه الصفحة يمكنك التحكم الشامل بصلاحيات كافة الحسابات واللجان، وتفعيل أو إطفاء الخصائص لكل جهة بضغطة زر.</p>`;
file = file.replace(permTitle, permTitleNew);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', file);
console.log("Fixed SuperAdminPanel.jsx");
