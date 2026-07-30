const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// For Login CMS Link
const loginLinkSearch = `<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500">الرابط المباشر للبوابة:</span>
                            <a href="/login" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                              {window.location.origin}/login
                            </a>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/login'); triggerAlert('تم النسخ!'); }} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold">نسخ الرابط</button>
                        </div>`;

const loginLinkReplace = `<div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">الرابط المباشر للبوابة</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={loginCMS?.customLink ?? (window.location.origin + '/login')} 
                              onChange={(e) => setLoginCMS({...loginCMS, customLink: e.target.value})} 
                              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-left dir-ltr focus:outline-none focus:border-teal-500 transition-all text-indigo-600 dark:text-indigo-400 font-bold" 
                            />
                            <button onClick={() => { navigator.clipboard.writeText(loginCMS?.customLink || window.location.origin + '/login'); triggerAlert('تم النسخ!'); }} className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-colors">نسخ</button>
                          </div>
                        </div>`;
content = content.replace(loginLinkSearch, loginLinkReplace);

// For Public CMS Link
const publicLinkSearch = `<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500">الرابط المباشر للبوابة:</span>
                            <a href="/public-search" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                              {window.location.origin}/public-search
                            </a>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/public-search'); triggerAlert('تم النسخ!'); }} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold">نسخ الرابط</button>
                        </div>`;

const publicLinkReplace = `<div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">الرابط المباشر للبوابة</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={publicCMS?.customLink ?? (window.location.origin + '/public-search')} 
                              onChange={(e) => setPublicCMS({...publicCMS, customLink: e.target.value})} 
                              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-left dir-ltr focus:outline-none focus:border-teal-500 transition-all text-indigo-600 dark:text-indigo-400 font-bold" 
                            />
                            <button onClick={() => { navigator.clipboard.writeText(publicCMS?.customLink || window.location.origin + '/public-search'); triggerAlert('تم النسخ!'); }} className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-colors">نسخ</button>
                          </div>
                        </div>`;
content = content.replace(publicLinkSearch, publicLinkReplace);

// For Owner CMS Link
const ownerLinkSearch = `<div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500">الرابط المباشر للبوابة:</span>
                            <a href="/owner" target="_blank" className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline dir-ltr text-left mt-1">
                              {window.location.origin}/owner
                            </a>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/owner'); triggerAlert('تم النسخ!'); }} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 rounded-lg text-[10px] font-bold">نسخ الرابط</button>
                        </div>`;

const ownerLinkReplace = `<div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">الرابط المباشر للبوابة</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={ownerCMS?.customLink ?? (window.location.origin + '/owner')} 
                              onChange={(e) => setOwnerCMS({...ownerCMS, customLink: e.target.value})} 
                              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-left dir-ltr focus:outline-none focus:border-teal-500 transition-all text-indigo-600 dark:text-indigo-400 font-bold" 
                            />
                            <button onClick={() => { navigator.clipboard.writeText(ownerCMS?.customLink || window.location.origin + '/owner'); triggerAlert('تم النسخ!'); }} className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-colors">نسخ</button>
                          </div>
                        </div>`;
content = content.replace(ownerLinkSearch, ownerLinkReplace);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Fixed Links to be editable');
