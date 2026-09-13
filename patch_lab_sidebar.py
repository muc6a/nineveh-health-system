import re

def patch_lab():
    path = "src/pages/LabDashboard.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add Edit Tab button to sidebar
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
    
    # We need to wrap each button with {hasPerm(...)}
    # Let's just use a regex to replace the whole sidebar buttons section.
    # To do this safely, I will write a Node script to replace it precisely or use multi_replace_file_content if I can find the precise block.
    pass

if __name__ == "__main__":
    patch_lab()
