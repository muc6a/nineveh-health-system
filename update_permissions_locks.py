import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# 1. Add PERMISSION_ROLES
old_details_end = """          backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' }
        };"""
new_details_end = """          backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' }
        };

        const PERMISSION_ROLES = {
          manageEstablishments: 'management', createEst: 'management', editEst: 'management', deleteEst: 'management',
          addEval: 'team', showMainDashboard: 'management', showOperationsRoom: 'management', showReportsPage: 'management',
          showDirectivesPage: 'management', showPublicEvalsPage: 'management', sendDirective: 'management', replyDirective: 'team',
          canSendSOS: 'team', showSectorMap: 'team', showSmartTasks: 'team', showFieldTeamsStats: 'management',
          issueFine: 'management', closeEst: 'management', reopenEst: 'management',
          notify_closures: 'all', notify_inspections: 'all', notify_directives: 'all',
          exportData: 'management', viewAuditLogs: 'management', manageAccounts: 'management', manageSettings: 'management', backupData: 'management'
        };"""
content = content.replace(old_details_end, new_details_end)

# 2. Add Lock UI
old_ui = """                    return (
                      <div key={key} onClick={() => togglePermission(key)} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${isGranted ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-500/40 shadow-[0_0_20px_-5px_rgba(168,85,247,0.1)] dark:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]' : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/10'}`}>
                        {isGranted && <div className="absolute right-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>}
                        
                        <div className="flex flex-col pl-4 transition-transform duration-300 group-hover:-translate-x-1">
                          <span className={`text-sm font-black mb-1.5 transition-colors ${isGranted ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-200'}`}>{detail.title}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{detail.desc}</span>
                        </div>
                        
                        <div className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 border ${isGranted ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-300 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 shadow-inner'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-md ${isGranted ? 'left-1' : 'left-[26px]'}`}></div>
                        </div>
                      </div>
                    );"""

new_ui = """                    const accountRole = (selectedPermissionsAccount.id?.startsWith('team_') || selectedPermissionsAccount.id?.startsWith('tracker_')) ? 'team' : 'management';
                    const targetRole = PERMISSION_ROLES[key] || 'all';
                    const isOutofRole = targetRole !== 'all' && targetRole !== accountRole;

                    return (
                      <div key={key} onClick={() => togglePermission(key)} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${isGranted ? (isOutofRole ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-500/40 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]' : 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-500/40 shadow-[0_0_20px_-5px_rgba(168,85,247,0.1)]') : (isOutofRole ? 'bg-slate-100/50 dark:bg-slate-800/20 border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/40' : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/10')}`}>
                        {isGranted && <div className={`absolute right-0 top-0 bottom-0 w-1 shadow-md ${isOutofRole ? 'bg-amber-500 shadow-amber-500/50' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]'}`}></div>}
                        
                        <div className="flex flex-col pl-4 transition-transform duration-300 group-hover:-translate-x-1 w-full">
                          <div className="flex items-center gap-2 mb-1.5">
                            {isOutofRole && (
                               isGranted ? <Unlock className="w-4 h-4 text-amber-500 shrink-0" /> : <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className={`text-sm font-black transition-colors ${isGranted ? (isOutofRole ? 'text-amber-700 dark:text-amber-400' : 'text-purple-700 dark:text-purple-300') : 'text-slate-700 dark:text-slate-200'}`}>{detail.title}</span>
                            
                            {isOutofRole && (
                              <span className={`text-[9px] px-2 py-0.5 rounded border font-bold mr-auto shrink-0 ${isGranted ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/50' : 'bg-slate-200 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                                {isGranted ? 'استثناء مفعّل' : (targetRole === 'management' ? 'خاص بالإدارة' : 'خاص بالميدان')}
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] leading-relaxed font-medium pr-6 ${isOutofRole && !isGranted ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{detail.desc}</span>
                        </div>
                        
                        {!isOutofRole ? (
                          <div className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 border ${isGranted ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-300 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 shadow-inner'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-md ${isGranted ? 'left-1' : 'left-[26px]'}`}></div>
                          </div>
                        ) : (
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 border shadow-sm ${isGranted ? 'bg-amber-500 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:bg-amber-600' : 'bg-slate-200 text-slate-400 border-slate-300 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700/80'}`}>
                             {isGranted ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                           </div>
                        )}
                      </div>
                    );"""

content = content.replace(old_ui, new_ui)

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)

print("Done updating SuperAdminPanel.jsx locks")
