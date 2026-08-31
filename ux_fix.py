import sys

def main():
    with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
        sap = f.read()

    # 1. Activities and Fines Heading Replacement
    old_heading = """            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Gavel className="w-5 h-5 text-teal-600" />
              <span>إدارة النشاطات والقوانين الرقابية</span>
            </h2>"""
    new_heading = """            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-teal-600" />
                نافذة التحكم المركزية لتخصيص بنود التقييم الصحي وتحديث قائمة المخالفات والغرامات القانونية.
              </p>
            </div>"""
    sap = sap.replace(old_heading, new_heading)

    # 2. General Settings Sub-tabs Replacement
    old_general_tabs = """            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 flex-wrap">
              <button
                onClick={() => setSubSettingsTab('identity')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  (subSettingsTab === 'identity' || subSettingsTab === 'database')
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                🎨 الهوية والترويسة
              </button>
              <button
                onClick={() => setSubSettingsTab('public_cms')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'public_cms'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                📢 إدارة البوابات
              </button>

            </div>"""
    
    new_general_tabs = """            <div className="flex gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
              <button
                onClick={() => setSubSettingsTab('identity')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${(!subSettingsTab || subSettingsTab === 'identity' || subSettingsTab === 'database') ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                🎨 الهوية والترويسة
              </button>
              <button
                onClick={() => setSubSettingsTab('public_cms')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subSettingsTab === 'public_cms' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                📢 إدارة البوابات
              </button>
            </div>"""
    sap = sap.replace(old_general_tabs, new_general_tabs)

    # 3. Roster Sub-tabs Replacement
    # Need to find the exact block for roster tabs. I'll use index finding to be robust.
    roster_start_marker = "            {/* Sub Roster Tabs Selection Bar */}"
    roster_end_marker = """              </button>
            </div>"""
    idx_r_start = sap.find(roster_start_marker)
    if idx_r_start != -1:
        idx_r_end = sap.find(roster_end_marker, idx_r_start) + len(roster_end_marker)
        
        new_roster_tabs = """            {/* Sub Roster Tabs Selection Bar */}
            <div className="flex gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 overflow-x-auto hide-scrollbar whitespace-nowrap">
              <button
                onClick={() => setSubRosterTab('directors')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${(!subRosterTab || subRosterTab === 'directors') ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                👑 إدارة المدراء والقيادات
              </button>
              <button
                onClick={() => setSubRosterTab('labs')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subRosterTab === 'labs' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                🔬 المختبرات المركزية
              </button>
              <button
                onClick={() => setSubRosterTab('committees')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subRosterTab === 'committees' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                👥 إدارة اللجان الميدانية
              </button>
              <button
                onClick={() => setSubRosterTab('accountants')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subRosterTab === 'accountants' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                💼 إدارة المحاسبين
              </button>
            </div>"""
        
        sap = sap[:idx_r_start] + new_roster_tabs + sap[idx_r_end:]

    # 4. Top Navbar Layout and Sizing
    old_nav_container = '<div className="w-full max-w-7xl mx-auto flex flex-nowrap justify-between items-center overflow-hidden gap-0.5 md:gap-1 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 sticky top-0 z-[999] bg-slatebg-light dark:bg-slatebg-dark pt-2 -mt-2">'
    new_nav_container = '<div className="w-full max-w-[1400px] mx-auto flex flex-nowrap justify-evenly items-center overflow-hidden gap-1 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 sticky top-0 z-[999] bg-slatebg-light dark:bg-slatebg-dark pt-2 -mt-2">'
    sap = sap.replace(old_nav_container, new_nav_container)
    
    old_btn = 'px-1.5 py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-black whitespace-nowrap text-ellipsis overflow-hidden transition-all flex flex-1 justify-center items-center gap-1 cursor-pointer'
    new_btn = 'px-2 py-2 rounded-xl text-[10px] sm:text-xs md:text-sm font-black whitespace-nowrap transition-all flex flex-1 justify-center items-center gap-1.5 cursor-pointer'
    sap = sap.replace(old_btn, new_btn)
    
    old_icon = 'className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />'
    new_icon = 'className="w-3.5 h-3.5 md:w-4.5 md:h-4.5 shrink-0" />'
    sap = sap.replace(old_icon, new_icon)

    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(sap)
    print("UX fixes applied successfully.")

if __name__ == "__main__":
    main()
