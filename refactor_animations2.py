import re

def main():
    with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
        team_code = f.read()

    # The top stats cards in TeamDashboard.jsx
    old_team_stats = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-teal-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">إجمالي المنشآت المخصصة للجنة</span>
                <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mt-3">{totalShops}</p>
                <span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
              </div>
              <div
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-emerald-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت تم زيارتها بنجاح هذا الشهر 🟢</span>
                <p className="text-4xl font-extrabold text-emerald-500 mt-3">{inspectedShops}</p>
                <span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
              </div>
              <div
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-red-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت متأخرة بانتظار الزيارة الفورية 🔴</span>
                <p className="text-4xl font-extrabold text-red-500 mt-3">{uninspectedShops}</p>
                <span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>
              </div>
            </div>"""

    new_team_stats = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl border border-teal-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer select-none text-right group relative overflow-hidden"
              >
                <Building className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-teal-400/10 group-hover:scale-110 group-hover:text-teal-400/20 transition-all duration-500" />
                <span className="text-xs font-black text-teal-400/80 z-10 relative">إجمالي المنشآت المخصصة للجنة</span>
                <p className="text-4xl font-extrabold text-teal-400 mt-3 z-10 relative">{totalShops}</p>
                <span className="text-[10px] text-teal-400/60 font-bold block mt-3 bg-teal-500/10 px-2 py-1 w-fit rounded-lg z-10 relative">انقر للتفاصيل 👁️</span>
              </div>
              <div
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer select-none text-right group relative overflow-hidden"
              >
                <CheckCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-400/10 group-hover:scale-110 group-hover:text-emerald-400/20 transition-all duration-500" />
                <span className="text-xs font-black text-emerald-400/80 z-10 relative">منشآت تم زيارتها بنجاح هذا الشهر</span>
                <p className="text-4xl font-extrabold text-emerald-400 mt-3 z-10 relative">{inspectedShops}</p>
                <span className="text-[10px] text-emerald-400/60 font-bold block mt-3 bg-emerald-500/10 px-2 py-1 w-fit rounded-lg z-10 relative">انقر للتفاصيل 👁️</span>
              </div>
              <div
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="p-5 rounded-2xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer select-none text-right group relative overflow-hidden"
              >
                <AlertTriangle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-red-400/10 group-hover:scale-110 group-hover:text-red-400/20 transition-all duration-500" />
                <span className="text-xs font-black text-red-400/80 z-10 relative">منشآت متأخرة بانتظار الزيارة الفورية</span>
                <p className="text-4xl font-extrabold text-red-400 mt-3 z-10 relative">{uninspectedShops}</p>
                <span className="text-[10px] text-red-400/60 font-bold block mt-3 bg-red-500/10 px-2 py-1 w-fit rounded-lg z-10 relative">انقر للتفاصيل 👁️</span>
              </div>
            </div>"""

    if old_team_stats in team_code:
        team_code = team_code.replace(old_team_stats, new_team_stats)
        if 'Building' not in team_code:
            team_code = team_code.replace('Activity } from', 'Activity, Building, CheckCircle, AlertTriangle } from')

    with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(team_code)

    print("TeamDashboard Success!")

if __name__ == '__main__':
    main()
