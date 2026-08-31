import sys

def main():
    with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
        sap = f.read()

    # 1. State definitions for permissions
    target_state = "const [selectedPermissionsAccount, setSelectedPermissionsAccount] = useState(null);"
    replacement_state = target_state + """
  const totalPerms = Object.keys(DEFAULT_PERMISSIONS || {}).length;
  const grantedPerms = selectedPermissionsAccount?.permissions ? Object.keys(DEFAULT_PERMISSIONS || {}).filter(k => selectedPermissionsAccount.permissions?.[k]).length : 0;
  const progressPercentage = totalPerms ? Math.round((grantedPerms / totalPerms) * 100) : 0;
"""
    if "const totalPerms =" not in sap:
        sap = sap.replace(target_state, replacement_state, 1)

    # 2. Extract evaluations and fines_booklet
    start_eval = '{subSettingsTab === "evaluations" && ('
    idx1 = sap.find(start_eval)
    
    idx_end = sap.find('{/* Tab 2: Settings & Parameters */}')
    
    if idx1 != -1 and idx_end != -1:
        # Go back from idx_end to find the closing tags of general_settings section.
        # Actually just extract everything up to `            </div>\n          </section>\n        )}`
        # Let's just find the closest `</section>` before Tab 2
        idx_sec = sap.rfind('</section>', idx1, idx_end)
        if idx_sec != -1:
            # But the `</div>` is before it. We can just extract from idx1 to idx_sec.
            # But wait, there is `</div>` before `</section>`.
            idx_div = sap.rfind('</div>', idx1, idx_sec)
            
            extracted = sap[idx1:idx_div]
            
            # Remove from original
            sap = sap[:idx1] + sap[idx_div:]
            
            # Clean up the conditional wrappers
            clean_extracted = extracted.replace('{subSettingsTab === "evaluations" && (', '')
            clean_extracted = clean_extracted.replace('{subSettingsTab === "fines_booklet" && (', '')
            # Replace the floating `)}` lines
            clean_extracted = clean_extracted.replace('              )}\n', '')
            clean_extracted = clean_extracted.replace('              )}', '')
            
            permissions_start = "        {activeTab === 'permissions' && ("
            activities_section = f"""        {{activeTab === 'activities_fines' && (
          <section className="glassmorphic-card p-6 animate-fade-in-up text-right">
            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <Gavel className="w-5 h-5 text-teal-600" />
              <span>إدارة النشاطات والقوانين الرقابية</span>
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {clean_extracted}
            </div>
          </section>
        )}}
"""
            sap = sap.replace(permissions_start, activities_section + "\n" + permissions_start)

    # 3. Fix horizontal scroll on top nav
    nav_target = 'className="max-w-7xl mx-auto flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-2 whitespace-nowrap"'
    nav_replacement = 'className="max-w-7xl mx-auto flex flex-wrap gap-2 md:gap-3 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-4 sticky top-0 z-[999] bg-slatebg-light dark:bg-slatebg-dark pt-2 -mt-2"'
    sap = sap.replace(nav_target, nav_replacement)

    # 4. Font sizes of buttons (replace px-4 py-2.5 rounded-2xl text-xs font-black)
    btn_target = "px-4 py-2.5 rounded-2xl text-xs font-black"
    btn_replace = "px-4 py-2.5 rounded-2xl text-sm md:text-base font-black"
    sap = sap.replace(btn_target, btn_replace)

    # 5. Add description text to permissions
    desc_target = """            <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-teal-600" />
              <span>مركز الصلاحيات السيادي (Role-Based Access Control)</span>
            </h2>"""
    desc_replacement = desc_target + """\n            <p className="text-sm text-slate-500 mb-6 text-right font-medium">من خلال هذه الصفحة يمكنك التحكم الشامل بصلاحيات كافة الحسابات واللجان، وتفعيل أو إطفاء الخصائص لكل جهة بضغطة زر.</p>"""
    if "من خلال هذه الصفحة يمكنك التحكم الشامل" not in sap:
        sap = sap.replace(desc_target, desc_replacement)
        
    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(sap)
    print("Repair script completed successfully")

if __name__ == "__main__":
    main()
