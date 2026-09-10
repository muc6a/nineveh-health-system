import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the buttons with hasPerm wrapper
button_stats = r"""<button\s*onClick=\{\(\) => \{ setActiveTab\('stats'\); setIsSidebarOpen\(false\); \}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 \$\{\s*activeTab === 'stats'\s*\?\s*'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'\s*:\s*'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'\s*\}\`\}\s*>\s*<BarChart3 className="w-4.5 h-4.5" />\s*<span>الرئيسية والتقارير</span>\s*</button>"""

button_incoming = r"""<button\s*onClick=\{\(\) => \{ setActiveTab\('incoming'\); setIsSidebarOpen\(false\); \}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between \$\{\s*activeTab === 'incoming'\s*\?\s*'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'\s*:\s*'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'\s*\}\`\}\s*>\s*<div className="flex items-center gap-3">\s*<Clock className="w-4.5 h-4.5" />\s*<span>الطلبات الواردة</span>\s*</div>\s*\{incomingReqs\.length > 0 && \(\s*<span className=\{`text-\[10px\] px-2 py-0.5 rounded-full \$\{activeTab === 'incoming' \? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'\}`\}>\{incomingReqs\.length\}</span>\s*\)\}\s*</button>"""

button_testing = r"""<button\s*onClick=\{\(\) => \{ setActiveTab\('testing'\); setIsSidebarOpen\(false\); \}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-between \$\{\s*activeTab === 'testing'\s*\?\s*'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'\s*:\s*'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'\s*\}\`\}\s*>\s*<div className="flex items-center gap-3">\s*<FlaskConical className="w-4.5 h-4.5" />\s*<span>قيد الفحص</span>\s*</div>\s*\{testingReqs\.length > 0 && \(\s*<span className=\{`text-\[10px\] px-2 py-0.5 rounded-full \$\{activeTab === 'testing' \? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'\}`\}>\{testingReqs\.length\}</span>\s*\)\}\s*</button>"""

button_archive = r"""<button\s*onClick=\{\(\) => \{ setActiveTab\('archive'\); setIsSidebarOpen\(false\); \}\}\s*className=\{`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 \$\{\s*activeTab === 'archive'\s*\?\s*'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'\s*:\s*'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'\s*\}\`\}\s*>\s*<Archive className="w-4.5 h-4.5" />\s*<span>الأرشيف المختبري</span>\s*</button>"""


new_button_stats = """{hasPerm('labArchive') && (
            <button
              onClick={() => { setActiveTab('stats'); setIsSidebarOpen(false); }}
              className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                activeTab === 'stats'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>الرئيسية والتقارير</span>
            </button>
)}"""

new_button_incoming = """{hasPerm('receiveSamples') && (
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
                <span>الطلبات الواردة</span>
              </div>
              {incomingReqs.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'incoming' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>{incomingReqs.length}</span>
              )}
            </button>
)}"""

new_button_testing = """{hasPerm('enterLabResults') && (
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
                <span>قيد الفحص</span>
              </div>
              {testingReqs.length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'testing' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{testingReqs.length}</span>
              )}
            </button>
)}"""

new_button_archive = """{hasPerm('labArchive') && (
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
)}"""

content = re.sub(button_stats, new_button_stats, content)
content = re.sub(button_incoming, new_button_incoming, content)
content = re.sub(button_testing, new_button_testing, content)
content = re.sub(button_archive, new_button_archive, content)

# 2. Add GlobalHeader to LabDashboard
# Replace the header section.
# Looking for <div className="flex items-center justify-between mb-8">
header_pattern = r'<div className="flex items-center justify-between mb-8">.*?<WeatherWidget variant="compact" />\s*</div>\s*</div>\s*</div>\s*</div>'
# Wait, let's just use replace on the known structure.

