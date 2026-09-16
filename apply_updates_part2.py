import re

# 1. Update ROLE_CORE_BASICS in src/utils/constants.jsx
with open('src/utils/constants.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_roles = """export const ROLE_CORE_BASICS = {
  director: ['showMainDashboard'],
  central_director: ['showDirectivesPage', 'sendDirective', 'replyDirective', 'showPublicEvalsPage', 'showDeliveryPage', 'manageSmartTasks', 'authenticatePenalties', 'issueFine', 'closeEst', 'reopenEst', 'editEst', 'deleteEst', 'financialReports'],
  accountant: ['financialReports', 'payFines', 'dailyInventory'],
  financial_accountant: ['financialReports', 'payFines', 'dailyInventory'],
  team: ['showTeamDashboard', 'executeSmartTasks', 'showSectorMap', 'createEst', 'addEval', 'manageEstablishments'],
  lab: ['viewLabReports', 'receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive'],
  tracker: ['monitorClosures', 'searchAndAddPreliminaryEst']
};"""

new_roles = """export const ROLE_CORE_BASICS = {
  director: ['showMainDashboard', 'showDirectivesPage', 'sendDirective', 'replyDirective'],
  central_director: ['manageSmartTasks', 'authenticatePenalties', 'issueFine', 'closeEst', 'reopenEst', 'editEst', 'deleteEst', 'showPublicEvalsPage', 'showDeliveryPage', 'viewLabReports', 'financialReports', 'showDirectivesPage', 'sendDirective', 'replyDirective', 'quickTeamDispatch'],
  accountant: ['showDirectivesPage', 'financialReports', 'payFines', 'dailyInventory'],
  financial_accountant: ['showDirectivesPage', 'financialReports', 'payFines', 'dailyInventory'],
  team: ['showTeamDashboard', 'executeSmartTasks', 'showSectorMap', 'createEst', 'addEval', 'manageEstablishments'],
  lab: ['showDirectivesPage', 'sendDirective', 'replyDirective', 'viewLabReports', 'receiveSamples', 'enterLabResults', 'editLabResults', 'labArchive'],
  tracker: ['showDirectivesPage', 'monitorClosures', 'searchAndAddPreliminaryEst']
};"""

if 'director: [\'showMainDashboard\']' in content:
    content = content.replace(old_roles, new_roles)
    with open('src/utils/constants.jsx', 'w', encoding='utf-8') as f:
        f.write(content)


# 2. Update NotificationBell.jsx
with open('src/components/NotificationBell.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'const [activeTab, setActiveTab]' not in content:
    content = content.replace(
        "const [isOpen, setIsOpen] = useState(false);",
        "const [isOpen, setIsOpen] = useState(false);\n  const [activeTab, setActiveTab] = useState('all');"
    )

    tabs_ui = """
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-3 overflow-x-auto hide-scrollbar">
            <button onClick={() => setActiveTab('all')} className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>الكل</button>
            <button onClick={() => setActiveTab('closures')} className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'closures' ? 'bg-white dark:bg-slate-700 shadow-sm text-red-600 dark:text-red-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>إغلاقات وعقوبات</button>
            <button onClick={() => setActiveTab('tasks')} className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'tasks' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>مهام وكشوفات</button>
            <button onClick={() => setActiveTab('directives')} className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'directives' ? 'bg-white dark:bg-slate-700 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}>تبليغات عامة</button>
          </div>
"""

    filter_logic = """
          {(() => {
            const filteredNotifications = myNotifications.filter(n => {
              if (activeTab === 'all') return true;
              if (activeTab === 'closures' && (n.title?.includes('إغلاق') || n.title?.includes('تشميع') || n.title?.includes('غرامة') || n.title?.includes('عقوب'))) return true;
              if (activeTab === 'tasks' && (n.title?.includes('تفتيش') || n.title?.includes('كشف') || n.title?.includes('مهمة') || n.title?.includes('رقاب') || n.title?.includes('عينة'))) return true;
              if (activeTab === 'directives' && (n.title?.includes('تبليغ') || n.title?.includes('قرار') || n.title?.includes('توجيه') || n.title?.includes('إداري'))) return true;
              return false;
            });
            return filteredNotifications.length === 0 ? (
"""

    content = content.replace(
        "{myNotifications.length === 0 ? (",
        tabs_ui + filter_logic
    )
    
    content = content.replace(
        "{myNotifications.map(notif => (",
        "{filteredNotifications.map(notif => ("
    )
    
    # We added an anonymous function {(() => { ... return ... })()} to wrap the jsx
    # We need to close it where the old map ended.
    content = content.replace(
        "</div>\n          )}\n        </div>",
        "</div>\n          );\n          })()}\n        </div>"
    )

    with open('src/components/NotificationBell.jsx', 'w', encoding='utf-8') as f:
        f.write(content)


# 3. Update TeamDashboard.jsx Map
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

map_code = """
            {hasPerm('showSectorMap') && (
              <div className="mt-8 glassmorphic-card p-6 animate-fade-in-up flex flex-col min-h-[500px]">
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
                  <Map className="text-teal-600" />
                  الخريطة التفاعلية لقاطع المسؤولية الميدانية ({userSector})
                </h2>
                <p className="text-xs text-slate-500 mb-4">هذه الخريطة تعرض حصراً المنشآت الواقعة ضمن الرقعة الجغرافية المكلف بها فريقكم لتسهيل التوجيه الميداني (اضغط على المنشأة للتفاصيل).</p>
                <div className="flex-1 w-full overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 bg-white rounded-xl">
                  <NinevehMap
                    establishments={establishments}
                    isTeamView={true}
                    teamSector={userSector}
                    fullHeight={true}
                  />
                </div>
              </div>
            )}
"""

if 'الخريطة التفاعلية لقاطع المسؤولية الميدانية' not in content:
    # insert after the charts div inside activeTab === 'strategic'
    # we can find the end of the strategic tab by looking for:
    # الغرامات الفورية
    #               </div>
    #             </div>
    #           </div>
    #         )}
    #
    #         {/* Tab B: My Operations / Est List */}
    
    target_str = """                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span> الغرامات الفورية
                  </div>
                </div>
              </div>"""
              
    content = content.replace(
        target_str,
        target_str + map_code
    )

    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates Part 2 applied.")
