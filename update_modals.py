import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/SuperAdminPanel.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Fix Permissions Modal Header
target_1 = """                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-white/5">
                  <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 drop-shadow-md">"""
replacement_1 = """                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-white/5 shrink-0">
                  <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 drop-shadow-md">"""
content = content.replace(target_1, replacement_1)

# Fix Permissions Modal Footer
target_2 = """                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
                  <button onClick={handleSavePermissions}"""
replacement_2 = """                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5 shrink-0">
                  <button onClick={handleSavePermissions}"""
content = content.replace(target_2, replacement_2)

# Fix other modals (e.g., Director Edit/Add Modal)
target_3 = """                  <div className="flex justify-end gap-3 mt-8">
                    <button onClick={() => setShowAddDirectorModal(false)}"""
replacement_3 = """                  <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 shrink-0">
                    <button onClick={() => setShowAddDirectorModal(false)}"""
content = content.replace(target_3, replacement_3)

# Add flex-1 to their forms if not present
# This is a bit risky with regex, I'll just add flex-col max-h-[90vh] where needed
content = content.replace(
    """<div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-right p-8">""",
    """<div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-fade-in text-right p-8 flex flex-col max-h-[90vh]"><div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">"""
)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated SuperAdminPanel.jsx Modals")
