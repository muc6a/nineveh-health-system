import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/SuperAdminPanel.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Rename 'الأذينات' and 'الأذونات' to 'الصلاحيات'
content = content.replace("الأذونات", "الصلاحيات")
content = content.replace("الأذينات", "الصلاحيات")
content = content.replace("أذونات", "صلاحيات")
content = content.replace("أذينات", "صلاحيات")

# 2. Add Info (ⓘ) icon to names in Directors, Trackers, Accountants
# Directors Name Column
target_director_name = """<td className="p-4 text-slate-800 dark:text-slate-200">{d.name}</td>"""
replacement_director_name = """<td 
                            onClick={() => setSelectedTeamDetails(d)}
                            className="p-4 text-slate-800 dark:text-slate-200 cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-1.5"
                          >
                            <Info className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="underline decoration-dotted">{d.name}</span>
                          </td>"""
content = content.replace(target_director_name, replacement_director_name)

# Trackers Name Column
target_tracker_name = """<td className="p-4 font-black text-slate-800 dark:text-white">{t.name}</td>"""
replacement_tracker_name = """<td 
                            onClick={() => setSelectedTeamDetails(t)}
                            className="p-4 font-black text-slate-800 dark:text-white cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-1.5"
                          >
                            <Info className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="underline decoration-dotted">{t.name}</span>
                          </td>"""
content = content.replace(target_tracker_name, replacement_tracker_name)

# Accountants Name Column
# Wait, Accountants use `t` just like Trackers, and the line is identical to Trackers. Let's make sure it replaces both.
# If they are identical, `replace` will replace both.

# Let's fix Trackers buttons to include Permissions (الصلاحيات)
target_tracker_buttons = """<button
                                onClick={() => handleOpenEditAccount(t, 'tracker')}"""
replacement_tracker_buttons = """<button
                                onClick={() => handleOpenPermissions({ ...t, role: 'tracker' })}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 transition-all cursor-pointer text-[10px] flex items-center gap-1"
                              >
                                <Shield className="w-3.5 h-3.5" /> الصلاحيات
                              </button>
                              <button
                                onClick={() => handleOpenEditAccount(t, 'tracker')}"""
# Wait, Accountants also have `handleOpenEditAccount(t, 'accountant')`
# I should ensure I only replace the tracker one if it's unique, or just rely on the 'tracker' string.
content = content.replace(target_tracker_buttons, replacement_tracker_buttons)

# Modify the SelectedTeamDetails Modal to hide Members if not a team
target_members_div = """{/* Members listing */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-black text-teal-600 dark:text-teal-400 block mb-3">👥 الكادر الإشرافي وأعضاء اللجنة الميدانية</span>"""
replacement_members_div = """{/* Members listing */}
              {(selectedTeamDetails.isTeam || selectedTeamDetails.role === 'team' || selectedTeamDetails.role === 'field_team') && (
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-black text-teal-600 dark:text-teal-400 block mb-3">👥 الكادر الإشرافي وأعضاء اللجنة الميدانية</span>"""

content = content.replace(target_members_div, replacement_members_div)

target_members_end = """</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTeamDetails(null)}"""
replacement_members_end = """</div>
              </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTeamDetails(null)}"""
content = content.replace(target_members_end, replacement_members_end)

# Also let's rename the title of the modal
target_modal_title = """<h3 className="text-sm font-black text-teal-600 dark:text-teal-400">🔍 بطاقة معلومات فريق التفتيش بالتفصيل</h3>"""
replacement_modal_title = """<h3 className="text-sm font-black text-teal-600 dark:text-teal-400">🔍 بطاقة معلومات الحساب بالتفصيل</h3>"""
content = content.replace(target_modal_title, replacement_modal_title)

# Let's change the labels in the modal to be generic
target_modal_label1 = """<span className="text-[10px] text-slate-400 block mb-1">اسم اللجنة</span>"""
replacement_modal_label1 = """<span className="text-[10px] text-slate-400 block mb-1">اسم الحساب</span>"""
content = content.replace(target_modal_label1, replacement_modal_label1)

# Ensure AccountModal.jsx also renames 'الأذونات'
filepath_modal = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/AccountModal.jsx"
with open(filepath_modal, "r", encoding="utf-8") as f:
    modal_content = f.read()

modal_content = modal_content.replace("الأذونات", "الصلاحيات")
modal_content = modal_content.replace("الأذينات", "الصلاحيات")
modal_content = modal_content.replace("أذونات", "صلاحيات")
modal_content = modal_content.replace("أذينات", "صلاحيات")

with open(filepath_modal, "w", encoding="utf-8") as f:
    f.write(modal_content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
