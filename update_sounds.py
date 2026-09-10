import re

# --- Update AppContext.jsx ---
with open("src/context/AppContext.jsx", "r", encoding="utf-8") as f:
    app_context = f.read()

# 1. Add soundPreferences state
if "const [soundPreferences, setSoundPreferences]" not in app_context:
    state_target = r"const \[uiPreferences, setUiPreferences\] = useState\(\(\) => \{[\s\S]*?\}\);"
    state_match = re.search(state_target, app_context)
    if state_match:
        new_state = state_match.group(0) + """

  const [soundPreferences, setSoundPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem('soundPreferences');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('soundPreferences', JSON.stringify(soundPreferences));
  }, [soundPreferences]);
"""
        app_context = app_context.replace(state_match.group(0), new_state)

# 2. Update context export to include soundPreferences
export_target = r"uiPreferences,\n\s*setUiPreferences"
export_replace = "uiPreferences,\n    setUiPreferences,\n    soundPreferences,\n    setSoundPreferences"
app_context = re.sub(export_target, export_replace, app_context)

# 3. Update playBeep
playbeep_target = r"const playBeep = \(type\) => \{[\s\S]*?    try \{[\s\S]*?      const audioCtx = new \(window\.AudioContext \|\| window\.webkitAudioContext\)\(\);"
playbeep_match = re.search(playbeep_target, app_context)
if playbeep_match:
    new_playbeep = """const playBeep = (type) => {
    try {
      if (soundPreferences && soundPreferences[type]) {
        const audio = new Audio(soundPreferences[type]);
        audio.play().catch(e => console.error("Error playing custom sound:", e));
        return;
      }
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();"""
    app_context = app_context.replace(playbeep_match.group(0), new_playbeep)

with open("src/context/AppContext.jsx", "w", encoding="utf-8") as f:
    f.write(app_context)


# --- Update SuperAdminPanel.jsx ---
with open("src/pages/SuperAdminPanel.jsx", "r", encoding="utf-8") as f:
    admin_panel = f.read()

# Add context destructuring for soundPreferences
context_target = r"uiPreferences, setUiPreferences, loginLogs"
context_replace = "uiPreferences, setUiPreferences, loginLogs, soundPreferences, setSoundPreferences, playBeep"
admin_panel = admin_panel.replace(context_target, context_replace)

if "soundPreferences, setSoundPreferences, playBeep" not in admin_panel:
    context_target2 = r"const \{\s*user,\s*establishments,\s*systemNotifications,\s*teams,\s*setTeams,\s*labRequests,\s*uiPreferences,\s*setUiPreferences,\s*loginLogs\s*\} = useContext\(AppContext\);"
    context_replace2 = "  const { user, establishments, systemNotifications, teams, setTeams, labRequests, uiPreferences, setUiPreferences, loginLogs, soundPreferences, setSoundPreferences, playBeep } = useContext(AppContext);"
    admin_panel = re.sub(context_target2, context_replace2, admin_panel)

# Add Tab Button
tab_target = r"\{user\?\.role === 'admin' && \(\s*<button\s*onClick=\{\(\) => setActiveTab\('settings'\)\}"
tab_replace = """{user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('sounds')}
            className={`px-1.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-[11px] font-black whitespace-nowrap transition-all flex flex-1 justify-center items-center gap-1 cursor-pointer ${
              activeTab === 'sounds'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" />
            <span>الإشعارات والأصوات</span>
          </button>
        )}
        
        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}"""
admin_panel = re.sub(tab_target, tab_replace, admin_panel)


# Add Tab Content
sounds_tab_content = """
        {activeTab === 'sounds' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Bell className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">مركز الإشعارات والأصوات</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">تخصيص النغمات وأصوات النظام المسموعة عند وقوع الأحداث.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'notification', label: 'إشعار جديد (رسالة، تنبيه عام)', defaultIcon: <Bell className="w-5 h-5"/> },
                  { id: 'success', label: 'إجراء ناجح (حفظ، إرسال، إنجاز)', defaultIcon: <CheckCircle className="w-5 h-5"/> },
                  { id: 'error', label: 'خطأ أو تنبيه هام (تلوث، رفض)', defaultIcon: <ShieldAlert className="w-5 h-5"/> },
                  { id: 'login', label: 'تسجيل الدخول للنظام', defaultIcon: <Power className="w-5 h-5"/> },
                ].map(event => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                        {event.defaultIcon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{event.label}</h4>
                        <p className="text-xs text-slate-500">{soundPreferences?.[event.id] ? 'نغمة مخصصة' : 'النغمة الافتراضية للنظام'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => playBeep(event.id)}
                        className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors cursor-pointer"
                        title="تجربة الصوت"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      
                      <label className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" /> رفع ملف
                        <input 
                          type="file" 
                          accept="audio/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 1024 * 1024) {
                                notify('حجم الملف كبير جداً، يرجى اختيار ملف أقل من 1 ميغابايت', 'error');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setSoundPreferences(prev => ({ ...prev, [event.target.result ? event.id : 'temp']: event.target.result })); // Hacky fix for closure
                                // Actually, need to bind event.id properly.
                              };
                              // We need a proper closure here for the ID.
                            }
                          }} 
                        />
                      </label>

                      {soundPreferences?.[event.id] && (
                        <button 
                          onClick={() => {
                            const newPrefs = { ...soundPreferences };
                            delete newPrefs[event.id];
                            setSoundPreferences(newPrefs);
                          }}
                          className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors cursor-pointer"
                          title="استعادة الافتراضي"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
"""

# I need to fix the input file closure issue above before inserting.
sounds_tab_content = sounds_tab_content.replace(
    "setSoundPreferences(prev => ({ ...prev, [event.target.result ? event.id : 'temp']: event.target.result }));",
    "setSoundPreferences(prev => ({ ...prev, [event.id]: event.target.result }));"
)

# Insert the tab content
tab_content_target = r"\{activeTab === 'settings' && \("
tab_content_replace = sounds_tab_content + "\n        {activeTab === 'settings' && ("
admin_panel = admin_panel.replace(tab_content_target, tab_content_replace)

# Make sure Play, Upload, RefreshCcw are imported
if "Play" not in admin_panel:
    import_target = r"import \{\s*CheckCircle,"
    import_replace = "import { CheckCircle, Play, Upload, RefreshCcw,"
    admin_panel = re.sub(import_target, import_replace, admin_panel)

with open("src/pages/SuperAdminPanel.jsx", "w", encoding="utf-8") as f:
    f.write(admin_panel)

