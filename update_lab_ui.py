import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add 'teams' to AppContext destructuring
context_target = r"const \{\s*user, setUser, navigate, notify, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences\s*,\s*globalLogout, hasPerm\s*\} = useContext\(AppContext\);"
context_replace = "  const { user, setUser, navigate, notify, labRequests, setLabRequests, systemNotifications, setSystemNotifications, establishments, playBeep, uiPreferences, globalLogout, hasPerm, teams } = useContext(AppContext);"
content = re.sub(context_target, context_replace, content)

# 2. Replace the blue banner with Team Analytics
banner_target = r"""<div className="bg-indigo-600 text-white rounded-\[2rem\] p-8 relative overflow-hidden shadow-xl shadow-indigo-600/20">[\s\S]*?<FlaskConical className="w-48 h-48 absolute -left-12 -bottom-12 text-white/10 transform -rotate-12" />\s*</div>"""

analytics_replace = """<div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white text-lg">إحصائيات العينات الواردة</h3>
                    <p className="text-xs text-slate-500">عدد العينات المرسلة من الفرق الميدانية</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(teams || []).map(team => {
                    const teamSamplesCount = (labRequests || []).filter(r => r.teamId === team.id || r.senderName === team.name).length;
                    return (
                      <div key={team.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{team.name}</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-black text-slate-800 dark:text-white">{teamSamplesCount}</span>
                          <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">عينة</span>
                        </div>
                      </div>
                    );
                  })}
                  {(teams?.length === 0) && (
                    <div className="col-span-full p-4 text-center text-slate-400 text-sm">
                      لا توجد فرق ميدانية مسجلة حتى الآن.
                    </div>
                  )}
                </div>
              </div>"""

content = re.sub(banner_target, analytics_replace, content)

# 3. Add RBAC to the "Create New Sample Manually" button
button_target = r"\{\(activeTab === 'incoming' \|\| activeTab === 'testing'\) && \(\s*<div className=\"mt-2\">\s*<button \s*onClick=\{\(\) => setNewSampleModal\(\{ isOpen: true \}\)\}"
button_replace = """{(activeTab === 'incoming' || activeTab === 'testing') && hasPerm('receiveSamples') && (
            <div className="mt-2">
              <button 
                onClick={() => setNewSampleModal({ isOpen: true })}"""
content = re.sub(button_target, button_replace, content)

# 4. Check RBAC for incoming sample receive button
receive_target = r"<button\s*onClick=\{\(\) => \{\s*const updated = \[\.\.\.labRequests\];\s*updated\[i\]\.status = 'under_testing';"
receive_replace = """{hasPerm('receiveSamples') && (
                          <button
                            onClick={() => {
                              const updated = [...labRequests];
                              updated[i].status = 'under_testing';"""
content = re.sub(receive_target, receive_replace, content)

# close the wrapper for receive button
receive_close_target = r"استلام العينة وإدخالها للفحص\s*</button>"
receive_close_replace = """استلام العينة وإدخالها للفحص
                          </button>
                        )}"""
content = re.sub(receive_close_target, receive_close_replace, content)

# 5. Check RBAC for enter results button
result_target = r"<button\s*onClick=\{\(\) => setResultModal\(\{ isOpen: true, request: req, mode: 'create' \}\)\}"
result_replace = """{hasPerm('enterLabResults') && (
                          <button 
                            onClick={() => setResultModal({ isOpen: true, request: req, mode: 'create' })}"""
content = re.sub(result_target, result_replace, content)

result_close_target = r"إدخال نتيجة الفحص\s*</button>"
result_close_replace = """إدخال نتيجة الفحص
                          </button>
                        )}"""
content = re.sub(result_close_target, result_close_replace, content)

# 6. Check RBAC for edit results button
# Already added editLabResults checking in LabDashboard? Wait, I added editLabResults checking in LabManager, not LabDashboard!
# Let's check LabDashboard for edit button.
edit_target = r"<button \s*onClick=\{\(\) => \{\s*setResultModal\(\{ isOpen: true, request: req, mode: 'edit' \}\);\s*setResultStatus\(req\.result \|\| 'safe'\);\s*setResultNotes\(req\.notes \|\| ''\);\s*\}\}\s*className=\"px-3 py-1\.5"
edit_replace = """{hasPerm('editLabResults') && (
                          <button 
                            onClick={() => {
                              setResultModal({ isOpen: true, request: req, mode: 'edit' });
                              setResultStatus(req.result || 'safe');
                              setResultNotes(req.notes || '');
                            }}
                            className="px-3 py-1.5"""
content = re.sub(edit_target, edit_replace, content)

edit_close_target = r"تعديل النتيجة\s*</button>"
edit_close_replace = """تعديل النتيجة
                          </button>
                        )}"""
content = re.sub(edit_close_target, edit_close_replace, content)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
