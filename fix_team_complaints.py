import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_complaints = """            {hasPerm('showPublicEvalsPage') && (
              <button
                onClick={() => { setActiveTab('complaints'); setComplaintTab('citizens'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'complaints' && complaintTab === 'citizens'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Compass className={`w-4.5 h-4.5 ${activeTab === 'complaints' && complaintTab === 'citizens' ? '' : 'text-rose-500'}`} />
                <span>شكاوى المواطنين</span>
              </button>
            )}
            
            {hasPerm('showDeliveryPage') && (
              <button
                onClick={() => { setActiveTab('complaints'); setComplaintTab('delivery'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'complaints' && complaintTab === 'delivery'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Package className={`w-4.5 h-4.5 ${activeTab === 'complaints' && complaintTab === 'delivery' ? '' : 'text-rose-500'}`} />
                <span>شكاوى خدمة التوصيل</span>
              </button>
            )}"""

new_complaints = """            {(hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) && (
              <button
                onClick={() => { setActiveTab('complaints'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'complaints'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Compass className={`w-4.5 h-4.5 ${activeTab === 'complaints' ? '' : 'text-rose-500'}`} />
                <span>الشكاوى</span>
              </button>
            )}"""

content = content.replace(old_complaints, new_complaints)

old_directives = """            {hasPerm('sendDirective') && (
              <button
                onClick={() => { setActiveTab('directives'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'directives'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Mail className={`w-4.5 h-4.5 ${activeTab === 'directives' ? '' : 'text-amber-500'}`} />
                <span>إرسال تبليغ</span>
              </button>
            )}
            {hasPerm('replyDirective') && (
              <button
                onClick={() => { setActiveTab('directives'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'directives'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Mail className={`w-4.5 h-4.5 ${activeTab === 'directives' ? '' : 'text-amber-500'}`} />
                <span>رد على التبليغات</span>
              </button>
            )}
            {hasPerm('showDirectivesPage') && (
              <button
                onClick={() => { setActiveTab('directives'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'directives'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Mail className={`w-4.5 h-4.5 ${activeTab === 'directives' ? '' : 'text-amber-500'}`} />
                <span>رؤية التبليغات</span>
              </button>
            )}"""

new_directives = """            {(hasPerm('showDirectivesPage') || hasPerm('sendDirective') || hasPerm('replyDirective')) && (
              <button
                onClick={() => { setActiveTab('directives'); setIsSidebarOpen(false); }}
                className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === 'directives'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <Mail className={`w-4.5 h-4.5 ${activeTab === 'directives' ? '' : 'text-amber-500'}`} />
                <span>التبليغات</span>
              </button>
            )}"""

content = content.replace(old_directives, new_directives)

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated TeamDashboard Sidebar")
