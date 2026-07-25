const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Fix Tab Buttons
content = content.replace(
  /👥 اللجان الميدانية \(الكلي: \{teams\.length\} \| نشط: \{teams\.filter\(t => t\.status !== "frozen"\)\.length\} \| مجمد: \{teams\.filter\(t => t\.status === "frozen"\)\.length\}\)/g,
  '👥 إدارة اللجان الميدانية'
);

content = content.replace(
  /👑 المدراء والقيادات \(الكلي: \{directors\?\.length \|\| 0\} \| نشط: \{directors\?\.filter\(d => d\.status !== "frozen"\)\.length \|\| 0\} \| مجمد: \{directors\?\.filter\(d => d\.status === "frozen"\)\.length \|\| 0\}\)/g,
  '👑 إدارة المدراء والقيادات'
);

content = content.replace(
  /🕵️‍♂️ المتابعين السريين \(الكلي: \{trackers\?\.length \|\| 0\} \| نشط: \{trackers\?\.filter\(t => t\.status !== "frozen"\)\.length \|\| 0\} \| مجمد: \{trackers\?\.filter\(t => t\.status === "frozen"\)\.length \|\| 0\}\)/g,
  '🕵️‍♂️ إدارة المتابعين السريين'
);

// 2. Add Stats Cards to Committees Tab
const oldCommitteesHeader = `{subRosterTab === 'committees' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-teal-600" />
                        <span>جدول الفرق ومحرك إدارة الحسابات الميدانية</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        يمكنك إضافة فرق جديدة، تعديل بياناتهم، تغيير القواطع الجغرافية، تجميد أو إيقاف الحسابات، والتحكم بالأذونات الخاصة بهم.
                      </p>
                    </div>`;

const newCommitteesHeader = `{subRosterTab === 'committees' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-teal-600" />
                        <span>جدول الفرق ومحرك إدارة الحسابات الميدانية</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        يمكنك إضافة فرق جديدة، تعديل بياناتهم، تغيير القواطع الجغرافية، تجميد أو إيقاف الحسابات، والتحكم بالأذونات الخاصة بهم.
                      </p>
                    </div>
                  </div>
                  
                  {/* Committees Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                      <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{teams.length}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">إجمالي الفرق</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 text-center">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{teams.filter(t => t.status !== 'frozen').length}</span>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-1">الفرق النشطة</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-center">
                      <span className="text-2xl font-black text-slate-500 dark:text-slate-400">{teams.filter(t => t.status === 'frozen').length}</span>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">الفرق المجمدة</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div></div>`;

content = content.replace(oldCommitteesHeader, newCommitteesHeader);

// 3. Add Stats Cards to Directors Tab
const oldDirectorsHeader = `{subRosterTab === 'directors' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <span>قيادات العمل والمدراء المركزيين</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        هنا تتم إدارة مدراء الشعب والمراكز. يمتلك المدراء صلاحيات أوسع للمصادقة على الإغلاق، مراقبة الغرامات، والاطلاع على الخرائط.
                      </p>
                    </div>`;

const newDirectorsHeader = `{subRosterTab === 'directors' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <span>قيادات العمل والمدراء المركزيين</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        هنا تتم إدارة مدراء الشعب والمراكز. يمتلك المدراء صلاحيات أوسع للمصادقة على الإغلاق، مراقبة الغرامات، والاطلاع على الخرائط.
                      </p>
                    </div>
                  </div>
                  
                  {/* Directors Stats */}
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
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div></div>`;

content = content.replace(oldDirectorsHeader, newDirectorsHeader);

// 4. Add Stats Cards to Trackers Tab
const oldTrackersHeader = `{subRosterTab === 'trackers' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-amber-600" />
                        <span>فرق المتابعة السريعة (الميدان)</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        هذه الفرق غير مقيدة بقاطع جغرافي واحد وتستجيب للتوجيهات العاجلة من غرفة العمليات فقط. لا يقومون بتقييم بل بمهام رصد وإغلاق محددة.
                      </p>
                    </div>`;

const newTrackersHeader = `{subRosterTab === 'trackers' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex flex-col">
                      <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-amber-600" />
                        <span>فرق المتابعة السريعة (الميدان)</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        هذه الفرق غير مقيدة بقاطع جغرافي واحد وتستجيب للتوجيهات العاجلة من غرفة العمليات فقط. لا يقومون بتقييم بل بمهام رصد وإغلاق محددة.
                      </p>
                    </div>
                  </div>
                  
                  {/* Trackers Stats */}
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
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div></div>`;

content = content.replace(oldTrackersHeader, newTrackersHeader);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);
console.log('SuperAdminPanel tabs and stats fixed.');
