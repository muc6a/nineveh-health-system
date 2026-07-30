const fs = require('fs');

let content = fs.readFileSync('src/pages/OwnerPortal.jsx', 'utf8');

// Add ownerCMS to context destructuring
const contextSearch = `const { establishments, navigate } = useContext(AppContext);`;
const contextReplace = `const { establishments, navigate, ownerCMS } = useContext(AppContext);`;
if (content.includes(contextSearch)) {
    content = content.replace(contextSearch, contextReplace);
}

// Replace Text Header with ownerCMS
const headerSearch = `          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">بوابة أصحاب المنشآت</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              يرجى إدخال الكود السري (PIN) المُسلم لك من قبل فرق الرقابة الصحية للاطلاع على التقرير.
            </p>
          </div>`;

const headerReplace = `          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
              {ownerCMS?.heroTitle || 'بوابة أصحاب المنشآت'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {ownerCMS?.heroSubtext || 'يرجى إدخال الكود السري (PIN) المُسلم لك من قبل فرق الرقابة الصحية للاطلاع على التقرير.'}
            </p>
          </div>
          
          {ownerCMS?.announcement && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl text-center">
              <span className="text-[11px] font-black text-red-700 dark:text-red-500">{ownerCMS.announcement}</span>
            </div>
          )}`;

if (content.includes(headerSearch)) {
    content = content.replace(headerSearch, headerReplace);
}

fs.writeFileSync('src/pages/OwnerPortal.jsx', content);
console.log('OwnerPortal.jsx updated with ownerCMS.');
