import re

with open("src/pages/ExecutivePortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace old header HTML with GlobalHeader
old_header = """        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-lg shadow-lg">
              📊
            </span>
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white">
                {activeTab === 'establishments' ? (PERMISSIONS_TABS.find(t => t.id === 'establishments')?.label || 'المنشآت') : 
                 activeTab === 'directives' ? 'التبليغات' : 
                 activeTab === 'complaints' ? 'شكاوى المواطنين' :
                 
                 activeTab === 'lab_management' ? 'قرارات المختبر' :
                 activeTab === 'team_reports' ? `تقارير ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'الفريق الميداني'}` :
                 (activeTab === 'none' ? (PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة') : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : `إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'المنظومة'}`))}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                {activeTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 
                 activeTab === 'directives' ? 'إرسال الأوامر والتعميمات للفرق الرقابية' :
                 activeTab === 'complaints' ? 'عرض شكاوى وملاحظات المواطنين الواردة من خلال مسح QR' :
                 
                 (activeTab === 'none' ? 'نظام إدارة الرقابة الصحية الموحد - محافظة نينوى' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            <NotificationBell />
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
              <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-slate-300">|</span>
              <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
              <WeatherWidget variant="full" />
            </div>
            {hasPerm('exportData') && (
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 no-print"
              >
                🖨️ طباعة الموقف الإحصائي اليومي
              </button>
            )}
          </div>
        </div>"""

new_header = """        <GlobalHeader
          icon="📊"
          title={
            activeTab === 'establishments' ? (PERMISSIONS_TABS.find(t => t.id === 'establishments')?.label || 'المنشآت') : 
            activeTab === 'directives' ? 'التبليغات' : 
            activeTab === 'complaints' ? 'شكاوى المواطنين' :
            
            activeTab === 'lab_management' ? 'قرارات المختبر' :
            activeTab === 'team_reports' ? `تقارير ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'الفريق الميداني'}` :
            (activeTab === 'none' ? (PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة') : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : `إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'المنظومة'`))}
          }
          subtitle={
            activeTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 
            activeTab === 'directives' ? 'إرسال الأوامر والتعميمات للفرق الرقابية' :
            activeTab === 'complaints' ? 'عرض شكاوى وملاحظات المواطنين الواردة من خلال مسح QR' :
            
            (activeTab === 'none' ? 'نظام إدارة الرقابة الصحية الموحد - محافظة نينوى' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة')
          }
          showPrintButton={true}
        />"""

# Also fix the import. Add GlobalHeader after UnifiedSidebar.
if "import { GlobalHeader } from '../components/GlobalHeader';" not in content:
    content = content.replace("import UnifiedSidebar from '../components/UnifiedSidebar';", "import UnifiedSidebar from '../components/UnifiedSidebar';\nimport { GlobalHeader } from '../components/GlobalHeader';")

content = content.replace(old_header, new_header)

with open("src/pages/ExecutivePortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)

