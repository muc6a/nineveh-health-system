import re

with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove geographic from getInitialExecutiveTab
content = content.replace(
    "if (hasPerm('showReportsPage')) return 'geographic';",
    ""
)

# 2. Remove geographic from initial check
content = content.replace(
    "if (activeTab === 'geographic' && !hasPerm('showReportsPage')) needsRedirect = true;",
    ""
)

# 3. Remove geographic from select change handler
content = content.replace(
    "else if (val === 'operations_room' || val === 'geographic' || val === 'directives' || val === 'complaints' || val === 'team_reports') {",
    "else if (val === 'operations_room' || val === 'directives' || val === 'complaints' || val === 'team_reports') {"
)

# 4. Remove geographic option from select
geographic_option = """            {hasPerm('showReportsPage') && (
              <option value="geographic">🗺️ الخريطة الجغرافية</option>
            )}"""
content = content.replace(geographic_option, "")

# 5. Remove geographic from header icons and texts
content = content.replace(
    "activeTab === 'geographic' ? '🗺️' : ",
    ""
)
content = content.replace(
    "activeTab === 'geographic' ? 'الخريطة التفاعلية' :",
    ""
)
content = content.replace(
    "activeTab === 'geographic' ? 'عرض المواقع الجغرافية للمنشآت حسب القطاع' :",
    ""
)

# 6. Move the geographic map into the strategic tab
old_strategic_end = """              </div>
            </div>






          </div>
        ) : activeTab === 'geographic' && hasPerm('showReportsPage') ? (
          <div className="w-full h-[85vh] min-h-[800px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 relative z-10 bg-slate-50 dark:bg-slate-900 flex flex-col p-6">
            <NinevehMap
              establishments={establishments}
              selectedSector={targetSector}
              onSectorSelect={handleMapSectorSelect}
              fullHeight={true}
            />
          </div>"""

new_strategic_end = """              </div>
            </div>

            {/* Strategic Map Integration */}
            {hasPerm('showReportsPage') && (
              <div className="w-full h-[70vh] min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/20 relative z-10 bg-slate-50 dark:bg-slate-900 flex flex-col p-6 mt-8">
                <NinevehMap
                  establishments={establishments}
                  selectedSector={targetSector}
                  onSectorSelect={handleMapSectorSelect}
                  fullHeight={true}
                />
              </div>
            )}

          </div>"""

content = content.replace(old_strategic_end, new_strategic_end)

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactored geographic map in ExecutivePortal.")
