import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace header section
header_pattern = re.compile(r'<header className="h-16 shrink-0 .*?</header>', re.DOTALL)

new_header = """<header className="shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex flex-col p-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 md:hidden mb-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <GlobalHeader
            icon="🧪"
            title={
              activeTab === 'stats' ? 'الرئيسية والتقارير' :
              activeTab === 'incoming' ? 'الطلبات الواردة' :
              activeTab === 'testing' ? 'عينات قيد الفحص' :
              activeTab === 'archive' ? 'الأرشيف المختبري' : 'المختبر المركزي'
            }
            subtitle="نظام إدارة المختبر المركزي الذكي - محافظة نينوى"
            showPrintButton={false}
          />
          {(activeTab === 'incoming' || activeTab === 'testing') && (
            <div className="mt-2">
              <button 
                onClick={() => setNewSampleModal({ isOpen: true })}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 cursor-pointer w-fit"
              >
                ➕ إنشاء عينة جديدة يدويًا
              </button>
            </div>
          )}
        </header>"""

content = header_pattern.sub(new_header, content)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)

