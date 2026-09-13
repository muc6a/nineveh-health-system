import re

def fix_lab_dash():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update the default state fallback logic (to prevent blank screen)
    fallback_logic = """
  React.useEffect(() => {
    // If activeTab is no longer permitted, fallback
    const canSeeStats = hasPerm('viewLabReports');
    const canSeeIncoming = hasPerm('receiveSamples');
    const canSeeTesting = hasPerm('enterLabResults');
    const canSeeEdit = hasPerm('editLabResults');
    const canSeeArchive = hasPerm('labArchive');
    
    let isAllowed = false;
    if (activeTab === 'stats' && canSeeStats) isAllowed = true;
    if (activeTab === 'incoming' && canSeeIncoming) isAllowed = true;
    if (activeTab === 'testing' && canSeeTesting) isAllowed = true;
    if (activeTab === 'edit' && canSeeEdit) isAllowed = true;
    if (activeTab === 'archive' && canSeeArchive) isAllowed = true;

    if (!isAllowed) {
       if (canSeeStats) setActiveTab('stats');
       else if (canSeeIncoming) setActiveTab('incoming');
       else if (canSeeTesting) setActiveTab('testing');
       else if (canSeeEdit) setActiveTab('edit');
       else if (canSeeArchive) setActiveTab('archive');
    }
  }, [user?.permissions, activeTab]);
"""
    if "const canSeeStats = hasPerm" not in content:
        content = re.sub(r"(const \[activeTab, setActiveTab\] = useState\([^)]+\);\n  const \[showDisplayPrefsModal, setShowDisplayPrefsModal\] = useState\(false\);.*?\n)", r"\1" + fallback_logic, content)

    # 2. Update Sidebar Buttons
    nav_start = content.find('<div className="space-y-1 mb-6">')
    if nav_start != -1:
        nav_end = content.find('</div>\n        </div>\n\n        {/* Preferences Toggle */}', nav_start)
        
        new_nav = """<div className="space-y-1 mb-6">
            {hasPerm('viewLabReports') && (
            <button
              onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'stats'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>التقارير المختبرية والرقابية للعينات</span>
            </button>
            )}
            
            {hasPerm('receiveSamples') && (
            <button
              onClick={() => { setActiveTab('incoming'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                activeTab === 'incoming'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-4.5 h-4.5" />
                <span>استلام العينات</span>
              </div>
              {incomingReqs.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'incoming' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>{incomingReqs.length}</span>
              )}
            </button>
            )}

            {hasPerm('enterLabResults') && (
            <button
              onClick={() => { setActiveTab('testing'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                activeTab === 'testing'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <FlaskConical className="w-4.5 h-4.5" />
                <span>إدخال نتائج الفحص</span>
              </div>
              {testingReqs.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'testing' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{testingReqs.length}</span>
              )}
            </button>
            )}

            {hasPerm('editLabResults') && (
            <button
              onClick={() => { setActiveTab('edit'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between ${
                activeTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileEdit className="w-4.5 h-4.5" />
                <span>تعديل النتائج</span>
              </div>
            </button>
            )}

            {hasPerm('labArchive') && (
            <button
              onClick={() => { setActiveTab('archive'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'archive'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Archive className="w-4.5 h-4.5" />
              <span>الأرشيف المختبري</span>
            </button>
            )}
          """
        content = content[:nav_start] + new_nav + content[nav_end:]

    # 3. Add 'edit' to the subtitle switch
    content = content.replace("activeTab === 'testing' ? 'عينات قيد الفحص' :", "activeTab === 'testing' ? 'إدخال نتائج الفحص' :\n              activeTab === 'edit' ? 'تعديل النتائج' :")
    content = content.replace("activeTab === 'stats' ? 'الرئيسية والتقارير' :", "activeTab === 'stats' ? 'التقارير المختبرية والرقابية للعينات' :")
    
    # 4. Wrap content blocks in hasPerm(...)
    content = content.replace("{activeTab === 'stats' && (", "{activeTab === 'stats' && hasPerm('viewLabReports') && (")
    content = content.replace("{activeTab === 'incoming' && (", "{activeTab === 'incoming' && hasPerm('receiveSamples') && (")
    content = content.replace("{activeTab === 'testing' && (", "{activeTab === 'testing' && hasPerm('enterLabResults') && (")
    content = content.replace("{activeTab === 'archive' && (", "{activeTab === 'archive' && hasPerm('labArchive') && (")

    edit_block = """
            {activeTab === 'edit' && hasPerm('editLabResults') && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="text-center p-12 text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                  <FileEdit className="w-12 h-12 mx-auto mb-4 text-indigo-500/50" />
                  <p>تعديل النتائج قيد التطوير...</p>
                </div>
              </div>
            )}
    """
    if "تعديل النتائج قيد التطوير" not in content:
        content = content.replace("{activeTab === 'archive' && hasPerm('labArchive') && (", edit_block + "\n            {activeTab === 'archive' && hasPerm('labArchive') && (")

    # 5. Fix icons import to include FileEdit
    if "FileEdit" not in content:
        content = content.replace("import {", "import {\n  FileEdit,")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_lab_dash()
