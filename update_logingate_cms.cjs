const fs = require('fs');

let content = fs.readFileSync('src/pages/LoginGate.jsx', 'utf8');

// Add loginCMS to context destructuring
const contextSearch = `const { navigate, setUser, config, teams, directors, trackers, notify } = useContext(AppContext);`;
const contextReplace = `const { navigate, setUser, config, teams, directors, trackers, notify, loginCMS } = useContext(AppContext);`;
if (content.includes(contextSearch)) {
    content = content.replace(contextSearch, contextReplace);
}

// Replace Text Header with loginCMS
const headerSearch = `        {/* Text Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">
            {config.headerText}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            بوابة تسجيل الدخول الإلكتروني للمفتشين واللجان الميدانية
          </p>
        </div>`;

const headerReplace = `        {/* Text Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
            {loginCMS?.heroTitle || config.headerText}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {loginCMS?.heroSubtext || 'بوابة تسجيل الدخول الإلكتروني للمفتشين واللجان الميدانية'}
          </p>
        </div>
        
        {loginCMS?.announcement && (
          <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl text-center">
            <span className="text-[11px] font-black text-amber-700 dark:text-amber-500">{loginCMS.announcement}</span>
          </div>
        )}`;

if (content.includes(headerSearch)) {
    content = content.replace(headerSearch, headerReplace);
}

fs.writeFileSync('src/pages/LoginGate.jsx', content);
console.log('LoginGate.jsx updated with loginCMS.');
