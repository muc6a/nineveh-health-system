const fs = require('fs');

let content = fs.readFileSync('src/components/AccountModal.jsx', 'utf8');

// 1. Add state for permissions
const stateSearch = `  const [directorScopeMode, setDirectorScopeMode] = useState('all'); // 'all' or 'sector'`;
const stateReplace = `  const [directorScopeMode, setDirectorScopeMode] = useState('all'); // 'all' or 'sector'
  const [directorPermissions, setDirectorPermissions] = useState({
    showMainDashboard: true,
    showReportsPage: true,
    manageEstablishments: true,
    showDeliveryPage: true,
    showDirectivesPage: true,
    sendDirectives: true,
    showPublicEvalsPage: true
  });
  
  const AVAILABLE_PERMISSIONS = [
    { id: 'showMainDashboard', label: 'لوحة القياس الرئيسية (الاستراتيجية)' },
    { id: 'showReportsPage', label: 'التقارير والإحصائيات الجغرافية' },
    { id: 'manageEstablishments', label: 'إدارة المنشآت والمطاعم' },
    { id: 'showDeliveryPage', label: 'سجل التوصيل والمناديب' },
    { id: 'showDirectivesPage', label: 'صندوق التوجيهات' },
    { id: 'sendDirectives', label: 'إرسال التوجيهات للفرق' },
    { id: 'showPublicEvalsPage', label: 'تقييمات وشكاوى المواطنين' }
  ];`;

if (!content.includes('const [directorPermissions')) {
    content = content.replace(stateSearch, stateReplace);
}

// 2. Add setting state on edit
const effectSearch = `        if (accountType === 'director') {
          setDirectorTitle(initialData.title || '');`;
const effectReplace = `        if (accountType === 'director') {
          setDirectorTitle(initialData.title || '');
          if (initialData.permissions) setDirectorPermissions(initialData.permissions);`;

if (!content.includes('setDirectorPermissions(initialData.permissions)')) {
    content = content.replace(effectSearch, effectReplace);
}

// 3. Add to result payload in handleSave
const payloadSearch = `      result.role = matchedRole ? matchedRole.id : 'director_custom';
      result.isDirector = true;
      result.isTeam = false;`;
const payloadReplace = `      result.role = matchedRole ? matchedRole.id : 'director_custom';
      result.isDirector = true;
      result.isTeam = false;
      result.permissions = directorPermissions;`;

if (!content.includes('result.permissions = directorPermissions;')) {
    content = content.replace(payloadSearch, payloadReplace);
}

// 4. Add UI checkboxes
const uiSearch = `                {directorScopeMode === 'sector' && renderGeoSelection()}
              </div>
            </>
          )}`;
const uiReplace = `                {directorScopeMode === 'sector' && renderGeoSelection()}
              </div>
              
              {/* 4. Permissions (New) */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <label className="text-teal-600 dark:text-teal-400 flex items-center gap-2"><CheckSquare className="w-4 h-4"/> 4. أذونات الوصول الخاصة بالمدير</label>
                <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_PERMISSIONS.map(perm => (
                    <label key={perm.id} className="flex items-center gap-3 p-3 bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-900/60 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={directorPermissions[perm.id] || false} 
                        onChange={(e) => setDirectorPermissions({...directorPermissions, [perm.id]: e.target.checked})} 
                        className="w-4 h-4 accent-teal-500 rounded" 
                      />
                      <span className="text-xs font-semibold text-slate-300">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}`;

if (!content.includes('أذونات الوصول الخاصة بالمدير')) {
    content = content.replace(uiSearch, uiReplace);
}

fs.writeFileSync('src/components/AccountModal.jsx', content);
console.log('Added permissions UI to AccountModal');
