with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# Add imports
if 'import { FinesManager }' not in content:
    content = content.replace("import { EvaluationManager } from '../components/EvaluationManager';", "import { EvaluationManager } from '../components/EvaluationManager';\nimport { FinesManager } from '../components/FinesManager';")

# Destructuring
old_ctx = "const { navigate, teams, setTeams, trackers, setTrackers, inspectionTemplates, setInspectionTemplates, config, setConfig, user, setUser, directors, setDirectors, setEstablishments, setReports, setDirectives, establishments, reports, directives, tickets, setTickets, auditLogs, logAudit, publicCMS, setPublicCMS, notify, globalBroadcast, setGlobalBroadcast, uiPreferences, setUiPreferences, loginCMS, setLoginCMS, ownerCMS, setOwnerCMS, activityTypes, setShowDisplayPrefsModal } = useContext(AppContext);"
new_ctx = "const { navigate, teams, setTeams, trackers, setTrackers, inspectionTemplates, setInspectionTemplates, config, setConfig, user, setUser, directors, setDirectors, setEstablishments, setReports, setDirectives, establishments, reports, directives, tickets, setTickets, auditLogs, logAudit, publicCMS, setPublicCMS, notify, globalBroadcast, setGlobalBroadcast, uiPreferences, setUiPreferences, loginCMS, setLoginCMS, ownerCMS, setOwnerCMS, activityTypes, setShowDisplayPrefsModal, accountants, setAccountants, finesBooklet, setFinesBooklet, fineTransactions, setFineTransactions } = useContext(AppContext);"
content = content.replace(old_ctx, new_ctx)

# Roster Button
old_roster_btn = """              <button
                onClick={() => setSubRosterTab('trackers')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subRosterTab === 'trackers'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                🕵️‍♂️ إدارة المتابعين ({trackers?.length || 0})
              </button>
            </div>"""
new_roster_btn = """              <button
                onClick={() => setSubRosterTab('trackers')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subRosterTab === 'trackers'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                🕵️‍♂️ إدارة المتابعين ({trackers?.length || 0})
              </button>
              <button
                onClick={() => setSubRosterTab('accountants')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subRosterTab === 'accountants'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                💼 إدارة المحاسبين ({accountants?.length || 0})
              </button>
            </div>"""
content = content.replace(old_roster_btn, new_roster_btn)

# Settings Button
old_settings_btn = """              <button
                onClick={() => setSubSettingsTab('evaluations')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'evaluations'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                إدارة النشاطات وبنود التقييم
              </button>
            </div>"""
new_settings_btn = """              <button
                onClick={() => setSubSettingsTab('evaluations')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'evaluations'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                إدارة النشاطات وبنود التقييم
              </button>
              <button
                onClick={() => setSubSettingsTab('fines_booklet')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'fines_booklet'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                كراس الغرامات القانونية
              </button>
            </div>"""
content = content.replace(old_settings_btn, new_settings_btn)

# Render FinesManager
old_render = """{subSettingsTab === "evaluations" && (
                <EvaluationManager />
              )}
            
            </div>
          </section>
        )}"""
new_render = """{subSettingsTab === "evaluations" && (
                <EvaluationManager />
              )}
              {subSettingsTab === "fines_booklet" && (
                <FinesManager />
              )}
            </div>
          </section>
        )}"""
content = content.replace(old_render, new_render)

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)
print("Applied Step 1 changes")
