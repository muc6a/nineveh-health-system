import os
import re

def main():
    sap_file = 'src/pages/SuperAdminPanel.jsx'
    with open(sap_file, 'r', encoding='utf-8') as f:
        sap = f.read()

    # 1. Define totalPerms, grantedPerms at the top of SuperAdminPanel
    # Find `const SuperAdminPanel = () => {` and insert after context hooks
    context_hook = r"const \{.*?\} =  globalLogout, useContext\(AppContext\);"
    match_ctx = re.search(context_hook, sap)
    
    if match_ctx:
        insert_pos = match_ctx.end()
        new_vars = """
  const totalPerms = Object.keys(DEFAULT_PERMISSIONS || {}).length;
  const grantedPerms = (typeof selectedPermissionsAccount !== 'undefined' && selectedPermissionsAccount) ? Object.keys(DEFAULT_PERMISSIONS || {}).filter(k => selectedPermissionsAccount.permissions?.[k]).length : 0;
  const progressPercentage = totalPerms ? Math.round((grantedPerms / totalPerms) * 100) : 0;
"""
        if "const totalPerms = Object.keys(DEFAULT_PERMISSIONS || {}).length;" not in sap:
            sap = sap[:insert_pos] + new_vars + sap[insert_pos:]

    # Remove all other instances of:
    # const totalPerms = Object.keys(DEFAULT_PERMISSIONS).length;
    # const grantedPerms = Object.keys(DEFAULT_PERMISSIONS).filter(k => selectedPermissionsAccount.permissions?.[k]).length;
    # const progressPercentage = Math.round((grantedPerms / totalPerms) * 100);
    
    # Use regex to strip them out
    old_defs = re.compile(r"^\s*const totalPerms = Object\.keys\(DEFAULT_PERMISSIONS\)\.length;\s*\n^\s*const grantedPerms = Object\.keys\(DEFAULT_PERMISSIONS\)\.filter\(k => selectedPermissionsAccount\.permissions\?\.\[k\]\)\.length;\s*\n^\s*const progressPercentage = Math\.round\(\(grantedPerms / totalPerms\) \* 100\);\s*\n", re.MULTILINE)
    sap = old_defs.sub("", sap)

    # 2. Fix duplicated title in general_settings
    dup_title = """            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Settings className="w-5 h-5 text-teal-600" />
              <span>هوية المنظومة والبوابات</span>
            </h2>"""
    if sap.count(dup_title) > 0:
        sap = sap.replace(dup_title, "", 1) # Only remove the first one (the inner one) if there are multiple, or just remove it if it's the one we don't want. 
        # Wait, the one inside general_settings tab:
        # {activeTab === 'general_settings' && (
        #   <section className="glassmorphic-card p-6 animate-fade-in-up text-right">
        #     <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
        #       <Settings className="w-5 h-5 text-teal-600" />
        #       <span>هوية المنظومة والبوابات</span>
        #     </h2>
    
    # Let's find exactly the block inside general_settings
    gen_set_start = "{activeTab === 'general_settings' && ("
    if gen_set_start in sap:
        idx1 = sap.find(gen_set_start)
        idx2 = sap.find("            <div className=\"flex gap-4", idx1)
        if idx1 != -1 and idx2 != -1:
            chunk = sap[idx1:idx2]
            if dup_title in chunk:
                new_chunk = chunk.replace(dup_title, "")
                sap = sap[:idx1] + new_chunk + sap[idx2:]

    # 3. Restore activities and fines booklet content inside activities_fines
    # I need to extract them from general_settings.
    # Where are they? In the original file, they are:
    # {subSettingsTab === "evaluations" && ( ... )}
    # {subSettingsTab === "fines_booklet" && ( ... )}
    # They are located inside general_settings block.
    
    eval_start = '{subSettingsTab === "evaluations" && ('
    fine_start = '{subSettingsTab === "fines_booklet" && ('
    
    # We find them using regex to match the whole block.
    # Since regex for nested {} is hard, I will find by string index.
    idx_eval = sap.find(eval_start)
    if idx_eval != -1:
        # Find where general_settings ends, it's `        {activeTab === 'permissions' && (`
        idx_end_gen = sap.find("        {activeTab === 'permissions' && (", idx_eval)
        if idx_end_gen == -1:
            idx_end_gen = sap.find("        {activeTab === 'activities_fines' && (", idx_eval)
        if idx_end_gen != -1:
            # We want to extract up to `</section>`
            idx_sec_close = sap.rfind("</section>", idx_eval, idx_end_gen)
            if idx_sec_close != -1:
                blocks = sap[idx_eval:idx_sec_close].strip()
                # Remove blocks from original location
                sap = sap[:idx_eval] + sap[idx_sec_close:]
                
                # Now insert blocks inside activities_fines
                act_start = "        {activeTab === 'activities_fines' && ("
                idx_act = sap.find(act_start)
                if idx_act != -1:
                    # Find `<div className="grid grid-cols-1 gap-8">` inside activities_fines
                    grid_start = '<div className="grid grid-cols-1 gap-8">'
                    idx_grid = sap.find(grid_start, idx_act)
                    if idx_grid != -1:
                        # insert blocks after grid_start
                        insert_point = idx_grid + len(grid_start)
                        sap = sap[:insert_point] + "\n" + blocks + "\n" + sap[insert_point:]

    # 4. Add text to permissions center
    perm_title = """            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <span>مركز الصلاحيات السيادي (Role-Based Access Control)</span>
            </h2>"""
    perm_title_new = perm_title + """\n            <p className="text-xs text-slate-500 mb-6 text-right font-medium">من خلال هذه الصفحة يمكنك التحكم الشامل بصلاحيات كافة الحسابات واللجان، وتفعيل أو إطفاء الخصائص لكل جهة بضغطة زر.</p>"""
    if "من خلال هذه الصفحة يمكنك التحكم الشامل" not in sap:
        sap = sap.replace(perm_title, perm_title_new)

    # 5. Fix Horizontal Scroll
    scroll_nav = '<div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap">'
    new_scroll_nav = '<div className="flex flex-wrap items-center gap-2 md:gap-3 pb-4">'
    sap = sap.replace(scroll_nav, new_scroll_nav)
    
    sap = sap.replace("px-4 py-2.5 rounded-2xl text-xs font-black", "px-3 py-2 rounded-xl text-[11px] font-black")

    with open(sap_file, 'w', encoding='utf-8') as f:
        f.write(sap)
    print("Fixed SuperAdminPanel.jsx")

    # 6. Global State Update fix in index.css
    css_file = 'src/index.css'
    with open(css_file, 'r', encoding='utf-8') as f:
        css = f.read()
    
    if ':root {' not in css:
        root_vars = """
:root {
  --heading-size: 18px;
  --body-size: 14px;
}
html {
  font-size: var(--body-size) !important;
}
.compact-mode {
  zoom: 0.9;
}
"""
        css = css.replace('@tailwind utilities;', '@tailwind utilities;\n' + root_vars)
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(css)
        print("Injected global state CSS variables in index.css")

if __name__ == "__main__":
    main()
