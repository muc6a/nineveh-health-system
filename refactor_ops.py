import re

def update_operations_room():
    path = "src/components/OperationsRoom.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add imports
    if "import NinevehMap" not in content:
        content = content.replace(
            "import { FinancialReports } from './FinancialReports';",
            "import { FinancialReports } from './FinancialReports';\nimport NinevehMap from './NinevehMap';"
        )
    
    # 2. Add Tab buttons for map and smart_tasks
    tabs_html = """
        {(user?.permissions?.showSectorMap || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('map')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'map' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <Database className="w-4 h-4" />الخريطة الشاملة
          </button>
        )}
        {(user?.permissions?.manageSmartTasks || user?.permissions?.executeSmartTasks || user?.role === 'admin' || user?.role === 'director') && (
          <button onClick={() => setActiveTab('smart_tasks')} className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'smart_tasks' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}>
            <CheckCircle className="w-4 h-4" />إدارة المهام (Smart Tasks)
          </button>
        )}
      </div>
    """
    
    # Replace the end of the tabs div with our new tabs
    if "الخريطة الشاملة" not in content:
        content = content.replace("</div>\n      )}", tabs_html)
    
    # 3. Add Content for map and smart_tasks
    # Add map content
    map_content = """
      {(user?.permissions?.showSectorMap || user?.role === 'admin' || user?.role === 'director') && activeTab === 'map' && (
        <div className="space-y-6">
          <div className="glassmorphic-card p-6 border border-indigo-500/20 h-[800px]">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">الخريطة الرقابية والتفاعلية המوحدة</h3>
            <NinevehMap 
              establishments={user?.sector ? establishments.filter(e => e.sector === user.sector) : establishments} 
              teams={teams}
            />
          </div>
        </div>
      )}
      
      {(user?.permissions?.manageSmartTasks || user?.permissions?.executeSmartTasks || user?.role === 'admin' || user?.role === 'director') && activeTab === 'smart_tasks' && (
        <div className="space-y-6">
          <div className="glassmorphic-card p-6 border border-blue-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-white mb-4">نظام توجيه المهام (Task Dispatch)</h3>
            
            {/* If user is management, show dispatch UI */}
            {(user?.permissions?.manageSmartTasks || user?.role === 'admin' || user?.role === 'director') ? (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500">قم بتوجيه أوامر التفتيش المباشرة للفرق الميدانية</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                     <label className="text-xs font-bold text-slate-700 block mb-2">اختر المنشأة المخالفة</label>
                     <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs">
                        <option>اختر...</option>
                        {establishments.slice(0,10).map(e => (
                           <option key={e.id}>{e.name} - {e.sector}</option>
                        ))}
                     </select>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                     <label className="text-xs font-bold text-slate-700 block mb-2">توجيه إلى الفرقة</label>
                     <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs">
                        <option>اختر...</option>
                        {teams.map(t => (
                           <option key={t.id}>{t.name}</option>
                        ))}
                     </select>
                  </div>
                  <div className="flex items-end">
                     <button onClick={() => triggerAlert('تم إرسال المهمة للفرقة الميدانية بنجاح')} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 text-xs font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        إصدار أمر تفتيش
                     </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500">المهام الموجهة إليك من غرفة العمليات</p>
                {/* Mock tasks for team */}
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-200 dark:border-red-900/30 flex justify-between items-center">
                   <div>
                      <h4 className="font-black text-red-700 dark:text-red-400 text-sm">مهمة تفتيش عاجلة: مطعم وكافيه الأمراء</h4>
                      <p className="text-xs text-red-600/80 mt-1">توجيه من غرفة العمليات المركزية بسبب شكوى مواطن. القطاع: الأيسر.</p>
                   </div>
                   <button onClick={() => triggerAlert('تم بدء المهمة وسيتم رفع التقرير للمركز')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md">
                      تنفيذ المهمة
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    """
    
    if "نظام توجيه المهام" not in content:
        # Insert before the closing tag of OperationsRoom
        content = content.replace("</div>\n    </div>\n  );\n}", map_content + "\n    </div>\n  );\n}")
        content = content.replace("</div>\n  );\n}", map_content + "\n  );\n}")
        
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated OperationsRoom.jsx")

if __name__ == "__main__":
    update_operations_room()
