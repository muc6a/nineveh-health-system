const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// Ensure Directors stats are injected correctly
if (!content.includes('إجمالي المدراء')) {
    const dirSearch = `<h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <span>قيادات العمل والمدراء المركزيين</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        هنا تتم إدارة مدراء الشعب والمراكز. يمتلك المدراء صلاحيات أوسع للمصادقة على الإغلاق، مراقبة الغرامات، والاطلاع على الخرائط.
                      </p>
                    </div>
                  </div>`;
    
    const dirReplace = dirSearch + `\n                  {/* Directors Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{directors?.length || 0}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">إجمالي المدراء</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{directors?.filter(d => d.status !== 'frozen').length || 0}</span>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-1">المدراء النشطين</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-center">
                      <span className="text-2xl font-black text-slate-500 dark:text-slate-400">{directors?.filter(d => d.status === 'frozen').length || 0}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">المدراء المجمدين</p>
                    </div>
                  </div>\n`;
    content = content.replace(dirSearch, dirReplace);
}

// Ensure Trackers stats are injected correctly
if (!content.includes('إجمالي المتابعين')) {
    const trackerSearch = `<h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-amber-600" />
                        <span>فرق المتابعة السريعة (الميدان)</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        هذه الفرق غير مقيدة بقاطع جغرافي واحد وتستجيب للتوجيهات العاجلة من غرفة العمليات فقط. لا يقومون بتقييم بل بمهام رصد وإغلاق محددة.
                      </p>
                    </div>
                  </div>`;
    
    const trackerReplace = trackerSearch + `\n                  {/* Trackers Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{trackers?.length || 0}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">إجمالي المتابعين</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{trackers?.filter(t => t.status !== 'frozen').length || 0}</span>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-1">المتابعين النشطين</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-center">
                      <span className="text-2xl font-black text-slate-500 dark:text-slate-400">{trackers?.filter(t => t.status === 'frozen').length || 0}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">المتابعين المجمدين</p>
                    </div>
                  </div>\n`;
    content = content.replace(trackerSearch, trackerReplace);
}

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('Directors and Trackers stats fixed.');
