import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I need to add internal tabs for Summary / Geographic Map when activeTab is 'summary' or 'geographic'
# Let's change activeTab === 'summary' to include both
old_summary = """        {activeTab === 'summary' && hasPerm('showMainDashboard') && (
          <div className="space-y-6 animate-fade-in-up">"""

new_summary = """        {(activeTab === 'summary' || activeTab === 'geographic') && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl mb-6">
              {hasPerm('showMainDashboard') && (
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'summary' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  اللوحة الاستراتيجية
                </button>
              )}
              {hasPerm('showReportsPage') && (
                <button
                  onClick={() => setActiveTab('geographic')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'geographic' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  الخريطة الجغرافية
                </button>
              )}
            </div>
            
            {activeTab === 'summary' && hasPerm('showMainDashboard') && (
              <div className="space-y-6 animate-fade-in-up">"""

content = content.replace(old_summary, new_summary)

# Now I need to close the extra div I added for summary, wait, summary had a div, let's close it before geographic
old_geo = """          </div>
        ) : activeTab === 'geographic' && hasPerm('showReportsPage') ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-120px)] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative">"""

new_geo = """              </div>
            )}
        {activeTab === 'geographic' && hasPerm('showReportsPage') && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-200px)] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative mt-6">"""

content = content.replace(old_geo, new_geo)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ExecutivePortal Advanced Management")
