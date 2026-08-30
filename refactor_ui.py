import os
import re

def main():
    # 1. Update ExecutivePortal.jsx
    ex_port = 'src/pages/ExecutivePortal.jsx'
    with open(ex_port, 'r', encoding='utf-8') as f:
        ex_content = f.read()
    
    ex_content = ex_content.replace(
        "إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name}",
        "إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'المنظومة'}"
    )
    
    with open(ex_port, 'w', encoding='utf-8') as f:
        f.write(ex_content)
        
    print("Fixed ExecutivePortal.jsx")

    # 2. Refactor SuperAdminPanel.jsx
    sap_file = 'src/pages/SuperAdminPanel.jsx'
    with open(sap_file, 'r', encoding='utf-8') as f:
        sap = f.read()

    # Add Gavel icon to imports if missing (lucide-react)
    if 'Gavel' not in sap:
        sap = re.sub(r'import \{ ([^}]+) \} from \'lucide-react\';', r'import { \1, Gavel } from \'lucide-react\';', sap)

    # Insert new tabs in the main horizontal menu
    tabs_search = """        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}"""
    
    new_tabs = """        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'permissions'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>مركز الصلاحيات</span>
          </button>
        )}
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('activities_fines')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'activities_fines'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Gavel className="w-4.5 h-4.5" />
            <span>إدارة النشاطات والقوانين الرقابية</span>
          </button>
        )}

""" + tabs_search

    if "activeTab === 'permissions'" not in sap:
        sap = sap.replace(tabs_search, new_tabs)

    # Now let's extract the `evaluations` and `fines_booklet` parts from `general_settings`
    # and put them into a new `activeTab === 'activities_fines'` section.

    # 1. Remove the buttons from general_settings
    buttons_to_remove = """              <button
                onClick={() => setSubSettingsTab('evaluations')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'evaluations'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                📝 إدارة النشاطات وبنود التقييم
              </button>
              <button
                onClick={() => setSubSettingsTab('fines_booklet')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'fines_booklet'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                💰 كراس الغرامات القانونية
              </button>"""
    sap = sap.replace(buttons_to_remove, "")
    
    # 2. Extract the evaluation content
    # I will use a simple split/replace logic since I know the structure.
    # The evaluation block starts with `{subSettingsTab === 'evaluations' && (` and ends before `{subSettingsTab === 'fines_booklet' && (`
    evaluations_start = "{subSettingsTab === 'evaluations' && ("
    fines_start = "{subSettingsTab === 'fines_booklet' && ("
    
    if evaluations_start in sap and fines_start in sap:
        # Find the end of fines block which is right before `</section>` of general_settings
        # Wait, the end of general_settings is:
        #           </section>
        #         )}
        #         {activeTab === 'settings' && (
        
        end_of_general_settings = "        {activeTab === 'settings' && ("
        
        start_idx = sap.find(evaluations_start)
        end_idx = sap.find(end_of_general_settings)
        
        # The content to move is sap[start_idx:end_idx] but we need to stop before `</section>`
        extracted_content = sap[start_idx:end_idx]
        
        # We need to split the extracted_content to not include `</section>\n        )}`
        # Let's find `</section>` backwards inside extracted_content
        section_end_idx = extracted_content.rfind("</section>")
        
        blocks_to_move = extracted_content[:section_end_idx].strip()
        
        # Now remove blocks_to_move from original general_settings
        sap = sap.replace(blocks_to_move, "")
        
        # And construct the new activities_fines tab
        activities_tab = f"""
        {{activeTab === 'activities_fines' && (
          <section className="glassmorphic-card p-6 animate-fade-in-up text-right">
            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Gavel className="w-5 h-5 text-teal-600" />
              <span>إدارة النشاطات والقوانين الرقابية</span>
            </h2>
            
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 flex-wrap">
{buttons_to_remove}
            </div>

            <div className="grid grid-cols-1 gap-8">
              {blocks_to_move}
            </div>
          </section>
        )}}
        """
        
        # Insert activities_tab right before `activeTab === 'settings'`
        sap = sap.replace(end_of_general_settings, activities_tab + "\n" + end_of_general_settings)

    print("Refactored General Settings to split into Activities & Fines.")

    # 3. Inject Permissions Center
    # We need a new state for the permissions tab dropdown `permissionsSelectedAccountId`
    if "const [permissionsSelectedAccountId, setPermissionsSelectedAccountId]" not in sap:
        sap = sap.replace(
            "const [activeTab, setActiveTab] = useState",
            "const [permissionsSelectedAccountId, setPermissionsSelectedAccountId] = useState('');\n  const [activeTab, setActiveTab] = useState"
        )
        
        # Add the all_accounts list generator in the render function before return (
        accounts_gen = """
  // Gather all accounts for the permissions center dropdown
  const allAccountsForPermissions = [
    { label: 'الفرق الميدانية', options: teams.map(t => ({ value: `team_${t.id}`, label: t.name, obj: t, type: 'team' })) },
    { label: 'مدراء الصحة (المدراء)', options: directors.map(d => ({ value: `director_${d.id}`, label: d.name, obj: d, type: 'director' })) },
    { label: 'المتابعين الميدانيين', options: trackers.map(tr => ({ value: `tracker_${tr.id}`, label: tr.name, obj: tr, type: 'tracker' })) },
    { label: 'المحاسبين الماليين', options: accountants.map(a => ({ value: `accountant_${a.id}`, label: a.name, obj: a, type: 'accountant' })) },
    { label: 'المختبرات المركزية', options: labs.map(l => ({ value: `lab_${l.id}`, label: l.name, obj: l, type: 'lab' })) }
  ];

  // When an account is selected in the permissions tab, we need to populate `selectedPermissionsAccount`
  const handlePermissionsAccountSelect = (e) => {
    const val = e.target.value;
    setPermissionsSelectedAccountId(val);
    if (!val) {
      setSelectedPermissionsAccount(null);
      return;
    }
    
    // Find the object
    for (let group of allAccountsForPermissions) {
      const found = group.options.find(opt => opt.value === val);
      if (found) {
        setSelectedPermissionsAccount(found.obj);
        // Important: Reset granted state to whatever is in the DB
        break;
      }
    }
  };
"""
        sap = sap.replace("return (", accounts_gen + "\n  return (")

    # Permissions center tab rendering
    permissions_tab = """
        {activeTab === 'permissions' && (
          <section className="glassmorphic-card p-6 animate-fade-in-up text-right">
            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <span>مركز الصلاحيات السيادي (Role-Based Access Control)</span>
            </h2>
            
            <div className="mb-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-3">اختر الحساب أو اللجنة المراد تعديل صلاحياتها:</label>
              <select
                value={permissionsSelectedAccountId}
                onChange={handlePermissionsAccountSelect}
                className="w-full md:w-1/2 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
              >
                <option value="">-- يرجى اختيار حساب من القائمة --</option>
                {allAccountsForPermissions.map((group, idx) => (
                  <optgroup key={idx} label={group.label} className="font-black text-teal-700 dark:text-teal-400">
                    {group.options.map(opt => (
                      <option key={opt.value} value={opt.value} className="font-semibold text-slate-800 dark:text-slate-200">{opt.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {selectedPermissionsAccount ? (
              <div className="flex flex-col md:flex-row gap-6 mt-8">
                {/* Right Sidebar: Tabs & Stats */}
                <div className="w-full md:w-1/3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex flex-col">
                  <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">الحساب المستهدف</p>
                    <p className="text-base font-black text-slate-800 dark:text-white mb-5 truncate">{selectedPermissionsAccount.name}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-black">
                        <span className="text-teal-600 dark:text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">ممنوح ({grantedPerms})</span>
                        <span className="text-slate-500">من {totalPerms} إذن</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800/80 ring-1 ring-slate-300 dark:ring-white/5 rounded-full h-2 overflow-hidden shadow-inner">
                        <div className="bg-gradient-to-l from-purple-500 via-indigo-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    {PERMISSIONS_TABS.filter(tab => {
                      if (tab.id === 'establishments' && (selectedPermissionsAccount?.role === 'director' || selectedPermissionsAccount?.role === 'central_director')) {
                        return false;
                      }
                      return true;
                    }).map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActivePermissionsTab(tab.id)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 cursor-pointer text-xs font-black relative overflow-hidden ${activePermissionsTab === tab.id ? 'bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 border border-transparent'}`}
                      >
                        {tab.icon}
                        <span className="relative z-10">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                    <button onClick={handleGrantAll} className="w-full py-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xs hover:bg-teal-500/20 transition-all cursor-pointer">
                      منح كل الصلاحيات (الكل)
                    </button>
                    <button onClick={handleRevokeAll} className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-black text-xs hover:bg-rose-500/20 transition-all cursor-pointer">
                      سحب كل الصلاحيات
                    </button>
                    <button
                      onClick={() => {
                        handleSavePermissions();
                        notify("تم تحديث الصلاحيات وحفظها في قاعدة البيانات فوراً بنجاح.", "success");
                      }}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      حفظ التعديلات فوراً
                    </button>
                  </div>
                </div>

                {/* Left Side: Permission Toggles */}
                <div className="w-full md:w-2/3 bg-white/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 p-6 md:p-8 relative">
                  <div className="mb-6 pb-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      {activeTabObj?.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800 dark:text-white">{activeTabObj?.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">تحكم بـ {activeTabObj?.keys.length} إذن ضمن هذا القسم</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTabObj?.keys.map(key => {
                      const permDef = DEFAULT_PERMISSIONS[key];
                      const isGranted = !!selectedPermissionsAccount.permissions?.[key];

                      return (
                        <div key={key} className={`p-4 rounded-2xl border transition-all duration-300 ${isGranted ? 'bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-teal-200 dark:border-teal-800/50 shadow-sm' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-white/5'}`}>
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h5 className={`text-xs font-black mb-1 ${isGranted ? 'text-teal-800 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300'}`}>
                                {permDef.title}
                              </h5>
                              <p className={`text-[10px] leading-relaxed ${isGranted ? 'text-teal-600/80 dark:text-teal-400/80' : 'text-slate-500'}`}>
                                {permDef.desc}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => {
                                setSelectedPermissionsAccount(prev => ({
                                  ...prev,
                                  permissions: {
                                    ...(prev.permissions || {}),
                                    [key]: !isGranted
                                  }
                                }));
                              }}
                              className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${isGranted ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm ${isGranted ? 'left-1' : 'left-7'}`}></div>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-bold text-sm">يرجى اختيار حساب من القائمة أعلاه لعرض وتعديل صلاحياته.</p>
              </div>
            )}
          </section>
        )}
"""
    if "activeTab === 'permissions' && (" not in sap:
        sap = sap.replace("        {activeTab === 'roster' && (", permissions_tab + "\n        {activeTab === 'roster' && (")

    with open(sap_file, 'w', encoding='utf-8') as f:
        f.write(sap)
        
    print("Injected Permissions Center logic")

if __name__ == "__main__":
    main()
