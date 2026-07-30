const fs = require('fs');

let content = fs.readFileSync('src/components/AccountModal.jsx', 'utf8');

const uiSearch = `              {/* 4. Permissions (New) */}
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
              </div>`;

if (content.includes('4. أذونات الوصول الخاصة بالمدير')) {
    content = content.replace(uiSearch, '');
    fs.writeFileSync('src/components/AccountModal.jsx', content);
    console.log('Removed permissions UI from AccountModal');
} else {
    console.log('Could not find the UI block.');
}
