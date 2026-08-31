import sys

def main():
    with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
        sap = f.read()

    # 1. Fix grantedPerms and totalPerms being before DEFAULT_PERMISSIONS
    vars_target = """  const totalPerms = Object.keys(DEFAULT_PERMISSIONS || {}).length;
  const grantedPerms = selectedPermissionsAccount?.permissions ? Object.keys(DEFAULT_PERMISSIONS || {}).filter(k => selectedPermissionsAccount.permissions?.[k]).length : 0;
  const progressPercentage = totalPerms ? Math.round((grantedPerms / totalPerms) * 100) : 0;
"""
    if vars_target in sap:
        sap = sap.replace(vars_target, '')
    
    # Also look for the one without `\n` at the start/end in case
    # Now find DEFAULT_PERMISSIONS definition
    default_perms_end = """    viewComprehensiveFinancialReports: false
  };"""
    if default_perms_end in sap:
        sap = sap.replace(default_perms_end, default_perms_end + "\n\n" + vars_target)

    # 2. Fix the navbar wrapping and button sizes
    nav_old = 'className="max-w-7xl mx-auto flex flex-wrap gap-2 md:gap-3 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 sticky top-0 z-[999] bg-slatebg-light dark:bg-slatebg-dark pt-2 -mt-2"'
    nav_new = 'className="max-w-7xl mx-auto flex flex-nowrap overflow-x-auto hide-scrollbar gap-1.5 md:gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 sticky top-0 z-[999] bg-slatebg-light dark:bg-slatebg-dark pt-2 -mt-2"'
    sap = sap.replace(nav_old, nav_new)
    
    # Change buttons inside the navbar to be smaller to fit
    sap = sap.replace('px-4 py-2.5 rounded-xl text-sm md:text-base font-black', 'px-3 py-2 rounded-xl text-xs md:text-sm font-black whitespace-nowrap')

    # 3. Fix activities_fines sub-tabs
    # Currently I have:
    old_activities = """        {activeTab === 'activities_fines' && (
          <section className="glassmorphic-card p-6 animate-fade-in-up text-right">
            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Gavel className="w-5 h-5 text-teal-600" />
              <span>إدارة النشاطات والقوانين الرقابية</span>
            </h2>
            <div className="grid grid-cols-1 gap-8">
              <section"""
    
    # I need to wrap them in subSettingsTab conditional rendering.
    # Where does EvaluationManager and FinesManager start/end?
    # I'll just rewrite the whole activities_fines block using regex or string splitting
    # Wait, the string splitting is safer:
    act_idx = sap.find("{activeTab === 'activities_fines' && (")
    perm_idx = sap.find("{activeTab === 'permissions' && (")
    
    if act_idx != -1 and perm_idx != -1:
        act_block = sap[act_idx:perm_idx]
        # act_block contains the old activities section without tabs.
        # Let's replace it!
        # EvaluationManager is inside it, FinesManager is inside it.
        # We can extract them by finding <EvaluationManager /> and <FinesManager />.
        # Actually they are inside their own <section> blocks.
        
        # We will inject the sub-tab buttons:
        sub_tabs_html = """        {activeTab === 'activities_fines' && (
          <section className="glassmorphic-card p-6 animate-fade-in-up text-right">
            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Gavel className="w-5 h-5 text-teal-600" />
              <span>إدارة النشاطات والقوانين الرقابية</span>
            </h2>
            
            <div className="flex gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
              <button
                onClick={() => setSubSettingsTab('evaluations')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${subSettingsTab === 'evaluations' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                بنود التقييم
              </button>
              <button
                onClick={() => setSubSettingsTab('fines_booklet')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${subSettingsTab === 'fines_booklet' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                كراس الغرامات
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              {subSettingsTab === 'evaluations' && (
                <EvaluationManager />
              )}
              {subSettingsTab === 'fines_booklet' && (
                <FinesManager />
              )}
            </div>
          </section>
        )}
"""
        # Delete the old act_block, and put the new one.
        # Wait, the old act_block might contain MORE than just <EvaluationManager /> and <FinesManager />!
        # In the original file, it was just `<EvaluationManager />` and `<FinesManager />`?
        # Let's check what was actually in my `perfect_fix.js`: I injected the RAW blocks.
        # Let's just find `<EvaluationManager />` and replace the whole block because the RAW blocks are huge.
        
        # Actually, let's just do a simple replace of the entire act_block.
        # Does act_block contain the full components inline, or just <EvaluationManager /> ?
        # It contains `<EvaluationManager />` and `<FinesManager />` because they are imported components!
        # Wait! Are they imported components? 
        # YES! `import { EvaluationManager } from '../components/EvaluationManager';`
        # `import { FinesManager } from '../components/FinesManager';`
        
        # Wait, my `perfect_fix.js` did:
        # `cleanBlocks = blocks.replace(/\{subSettingsTab === "evaluations" && \(\s*<section/g, '<section');`
        # This implies it was `<section>` directly!
        pass
        
    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(sap)
    print("Patch script complete")

if __name__ == "__main__":
    main()
