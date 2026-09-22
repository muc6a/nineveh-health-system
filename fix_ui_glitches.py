import os

# --- 1. Fix LabDashboard.jsx state leak ---
lab_dashboard_path = "src/pages/LabDashboard.jsx"
with open(lab_dashboard_path, 'r', encoding='utf-8') as f:
    lab_dashboard_content = f.read()

old_lab_tabs = """            {/* In-page Tabs (Matching Operations Room) */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
              {hasPerm('viewLabReports') && ("""

new_lab_tabs = """            {/* In-page Tabs (Matching Operations Room) */}
            {['stats', 'incoming', 'testing', 'archive'].includes(activeTab) && (
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
              {hasPerm('viewLabReports') && ("""

old_lab_tabs_end = """                </button>
              )}
            </div>"""

new_lab_tabs_end = """                </button>
              )}
            </div>
            )}"""

if old_lab_tabs in lab_dashboard_content and "{['stats', 'incoming', 'testing', 'archive'].includes(activeTab)" not in lab_dashboard_content:
    lab_dashboard_content = lab_dashboard_content.replace(old_lab_tabs, new_lab_tabs)
    # We must replace the first occurrence of the closing div of this block.
    # It occurs exactly before {/* STATS */}
    
    old_block_end = """                </button>
              )}
            </div>

            {/* STATS */}"""
            
    new_block_end = """                </button>
              )}
            </div>
            )}

            {/* STATS */}"""
            
    lab_dashboard_content = lab_dashboard_content.replace(old_block_end, new_block_end)
    
    with open(lab_dashboard_path, 'w', encoding='utf-8') as f:
        f.write(lab_dashboard_content)
    print("Fixed state leak in LabDashboard.jsx")


# --- 2. Fix TeamDashboard.jsx Cards UI ---
team_dashboard_path = "src/pages/TeamDashboard.jsx"
with open(team_dashboard_path, 'r', encoding='utf-8') as f:
    team_content = f.read()

# Replace the three cards in TeamDashboard
old_cards = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-teal-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
              >
                <Building2 className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-teal-500/5 dark:text-teal-400/5 group-hover:scale-110 group-hover:text-teal-500/10 dark:group-hover:text-teal-400/10 transition-all duration-500 pointer-events-none" />
                <div className="relative z-10">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">إجمالي المنشآت المخصصة للجنة</span>
                <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mt-3 relative z-10">{totalShops}</p>
                <span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
                </div>
              </div>
              <div 
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-emerald-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
              >
                <CheckCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-500/5 dark:text-emerald-400/5 group-hover:scale-110 group-hover:text-emerald-500/10 dark:group-hover:text-emerald-400/10 transition-all duration-500 pointer-events-none" />
                <div className="relative z-10">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت تم زيارتها بنجاح هذا الشهر 🟢</span>
                <p className="text-4xl font-extrabold text-emerald-500 mt-3 relative z-10">{inspectedShops}</p>
                <span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
                </div>
              </div>
              <div 
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-red-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
              >
                <AlertTriangle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-red-500/5 dark:text-red-400/5 group-hover:scale-110 group-hover:text-red-500/10 dark:group-hover:text-red-400/10 transition-all duration-500 pointer-events-none" />
                <div className="relative z-10">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت متأخرة بانتظار الزيارة الفورية 🔴</span>
                <p className="text-4xl font-extrabold text-red-500 mt-3 relative z-10">{uninspectedShops}</p>
                <span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
                </div>
              </div>
            </div>"""

new_cards = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="p-5 rounded-3xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl border border-teal-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer select-none text-right group relative overflow-hidden"
              >
                <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Building2 className="w-32 h-32 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-400 text-[10px] font-black tracking-wider uppercase bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">إحصائية شاملة</span>
                </div>
                <h3 className="text-xs text-teal-300/70 font-bold">إجمالي المنشآت المخصصة للجنة</h3>
                <span className="text-4xl lg:text-5xl font-black text-teal-500 mt-1 block relative z-10">{totalShops} <span className="text-sm text-teal-500/60 font-medium">منشأة</span></span>
              </div>
              <div 
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer select-none text-right group relative overflow-hidden"
              >
                <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <CheckCircle className="w-32 h-32 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 text-[10px] font-black tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">منجزة</span>
                </div>
                <h3 className="text-xs text-emerald-300/70 font-bold">منشآت تم زيارتها بنجاح</h3>
                <span className="text-4xl lg:text-5xl font-black text-emerald-500 mt-1 block relative z-10">{inspectedShops} <span className="text-sm text-emerald-500/60 font-medium">منشأة</span></span>
              </div>
              <div 
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="p-5 rounded-3xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer select-none text-right group relative overflow-hidden"
              >
                <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
                  <AlertTriangle className="w-32 h-32 text-white" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-400 text-[10px] font-black tracking-wider uppercase bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">متأخرة</span>
                </div>
                <h3 className="text-xs text-red-300/70 font-bold">بانتظار الزيارة الفورية</h3>
                <span className="text-4xl lg:text-5xl font-black text-red-500 mt-1 block relative z-10">{uninspectedShops} <span className="text-sm text-red-500/60 font-medium">منشأة</span></span>
              </div>
            </div>"""

if old_cards in team_content:
    team_content = team_content.replace(old_cards, new_cards)
    with open(team_dashboard_path, 'w', encoding='utf-8') as f:
        f.write(team_content)
    print("Updated TeamDashboard.jsx Cards UI")
else:
    print("Could not find the cards in TeamDashboard.jsx")

