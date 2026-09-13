import re

def fix_lab_dash():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fallback Logic
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

    # 2. Add 'edit' to the subtitle switch
    content = content.replace("activeTab === 'testing' ? 'عينات قيد الفحص' :", "activeTab === 'testing' ? 'إدخال نتائج الفحص' :\n              activeTab === 'edit' ? 'تعديل النتائج' :")
    content = content.replace("activeTab === 'stats' ? 'الرئيسية والتقارير' :", "activeTab === 'stats' ? 'التقارير المختبرية والرقابية للعينات' :")
    
    # 3. Replace the sidebar buttons individually using re.sub
    content = re.sub(
        r'(<button[^>]+onClick=\{\(\) => \{ setActiveTab\(\'stats\'\);[^>]+>[\s\S]*?</span>\s*</button>)',
        r"{hasPerm('viewLabReports') && (\1)}",
        content
    )
    content = re.sub(
        r'(<button[^>]+onClick=\{\(\) => \{ setActiveTab\(\'incoming\'\);[^>]+>[\s\S]*?</span>\s*</button>)',
        r"{hasPerm('receiveSamples') && (\1)}",
        content
    )
    content = re.sub(
        r'(<button[^>]+onClick=\{\(\) => \{ setActiveTab\(\'testing\'\);[^>]+>[\s\S]*?</button>)',
        r"{hasPerm('enterLabResults') && (\1)}",
        content
    )
    content = re.sub(
        r'(<button[^>]+onClick=\{\(\) => \{ setActiveTab\(\'archive\'\);[^>]+>[\s\S]*?</span>\s*</button>)',
        r"{hasPerm('labArchive') && (\1)}",
        content
    )

    # 4. Insert Edit Tab in sidebar (before archive)
    edit_btn = """
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
"""
    content = content.replace("{hasPerm('labArchive') && (<button", edit_btn + "\n            {hasPerm('labArchive') && (<button")

    # 5. Fix render components
    content = content.replace("{activeTab === 'stats' && (", "{activeTab === 'stats' && hasPerm('viewLabReports') && (")
    content = content.replace("{activeTab === 'incoming' && (", "{activeTab === 'incoming' && hasPerm('receiveSamples') && (")
    content = content.replace("{activeTab === 'testing' && (", "{activeTab === 'testing' && hasPerm('enterLabResults') && (")
    content = content.replace("{activeTab === 'archive' && (", "{activeTab === 'archive' && hasPerm('labArchive') && (")

    edit_block = """
            {activeTab === 'edit' && hasPerm('editLabResults') && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-sm min-h-[50vh] animate-in fade-in duration-500">
                <div className="text-center p-12 text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                  <FileEdit className="w-12 h-12 mx-auto mb-4 text-indigo-500/50" />
                  <p>قسم تعديل النتائج قيد التطوير...</p>
                </div>
              </div>
            )}
    """
    if "تعديل النتائج قيد التطوير" not in content:
        content = content.replace("{activeTab === 'archive' && hasPerm('labArchive') && (", edit_block + "\n            {activeTab === 'archive' && hasPerm('labArchive') && (")

    # 6. Icons import
    if "FileEdit" not in content:
        content = content.replace("import {", "import {\n  FileEdit,")

    # Change names in sidebar buttons
    content = content.replace("<span>الرئيسية والتقارير</span>", "<span>التقارير المختبرية والرقابية للعينات</span>")
    content = content.replace("<span>قيد الفحص</span>", "<span>إدخال نتائج الفحص</span>")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    fix_lab_dash()
