import re

def main():
    # ----------------------------------------------------
    # 1. ExecutivePortal.jsx
    # ----------------------------------------------------
    with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
        exec_code = f.read()

    # Add CheckCircle, ShieldX, Ban, Siren to lucide-react imports if not there
    if 'ShieldX' not in exec_code:
        exec_code = exec_code.replace('Building } from', 'Building, CheckCircle, ShieldX, Ban, Siren, Lock } from')

    # Card 1
    exec_code = exec_code.replace(
        '<div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">\n              <Building className="w-32 h-32 text-white" />\n            </div>',
        '<Building className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-white/10 group-hover:scale-110 group-hover:text-white/20 transition-all duration-500" />'
    )
    
    # Card 2
    exec_code = exec_code.replace(
        '<div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl border border-teal-800/40 text-right relative overflow-hidden"',
        '<div className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl border border-teal-800/40 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden"'
    )
    exec_code = exec_code.replace(
        '<div className="absolute top-2 left-2 opacity-5">\n              <TrendingUp className="w-32 h-32 text-teal-400" />\n            </div>',
        '<CheckCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-teal-400/10 group-hover:scale-110 group-hover:text-teal-400/20 transition-all duration-500" />'
    )

    # Card 3
    exec_code = exec_code.replace(
        '<div className="p-5 rounded-2xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 text-right relative overflow-hidden"',
        '<div className="p-5 rounded-2xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden"'
    )
    exec_code = exec_code.replace(
        '<div className="absolute top-2 left-2 opacity-5">\n              <AlertTriangle className="w-32 h-32 text-red-400" />\n            </div>',
        '<Siren className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-red-400/10 group-hover:scale-110 group-hover:text-red-400/20 transition-all duration-500" />'
    )

    # Card 4
    exec_code = exec_code.replace(
        '<div className="p-5 rounded-2xl bg-gradient-to-br from-orange-900 to-slate-900 text-white shadow-xl border border-orange-800/40 text-right relative overflow-hidden"',
        '<div className="p-5 rounded-2xl bg-gradient-to-br from-orange-900 to-slate-900 text-white shadow-xl border border-orange-800/40 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden"'
    )
    exec_code = exec_code.replace(
        '<div className="absolute top-2 left-2 opacity-5">\n              <AlertTriangle className="w-32 h-32 text-orange-400" />\n            </div>',
        '<Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-orange-400/10 group-hover:scale-110 group-hover:text-orange-400/20 transition-all duration-500" />'
    )

    with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
        f.write(exec_code)


    # ----------------------------------------------------
    # 2. SuperAdminPanel.jsx
    # ----------------------------------------------------
    with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
        admin_code = f.read()

    # The cards are similar, usually 4 cards with grid-cols-4. I will use regex if they are simple divs, but wait, they are:
    # "bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20"
    # Actually, the user asked to unify animations and icons across ALL dashboards for stats cards.
    # I should find all stats cards in SuperAdminPanel and apply gradients and animations.
    # Let's replace the top stats blocks.
    admin_top_stats_old = """                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-right">
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الفرق المسجلة</span>
                    <span className="text-xl font-black text-slate-800 dark:text-white">{teams.length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">اللجان النشطة الآن</span>
                    <span className="text-xl font-black text-emerald-500">{teams.filter(t => t.active).length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الحسابات المجمدة</span>
                    <span className="text-xl font-black text-red-500">{teams.filter(t => !t.active).length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الالقطاعات المغطاة</span>
                    <span className="text-xl font-black text-slate-800 dark:text-white">
                      {new Set(teams.map(t => t.sector)).size}
                    </span>
                  </div>
                </div>"""
                
    admin_top_stats_new = """                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-right">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700/50 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                    <Users className="absolute top-1/2 left-4 -translate-y-1/2 w-20 h-20 text-white/10 group-hover:scale-110 group-hover:text-white/20 transition-all duration-500" />
                    <span className="text-[11px] text-slate-400 font-bold block mb-1">الفرق المسجلة</span>
                    <span className="text-3xl font-black text-white">{teams.length}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                    <CheckCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-20 h-20 text-emerald-400/10 group-hover:scale-110 group-hover:text-emerald-400/20 transition-all duration-500" />
                    <span className="text-[11px] text-emerald-400/80 font-bold block mb-1">اللجان النشطة الآن</span>
                    <span className="text-3xl font-black text-emerald-400">{teams.filter(t => t.active).length}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                    <Ban className="absolute top-1/2 left-4 -translate-y-1/2 w-20 h-20 text-red-400/10 group-hover:scale-110 group-hover:text-red-400/20 transition-all duration-500" />
                    <span className="text-[11px] text-red-400/80 font-bold block mb-1">الحسابات المجمدة</span>
                    <span className="text-3xl font-black text-red-400">{teams.filter(t => !t.active).length}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-800/40 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                    <MapPin className="absolute top-1/2 left-4 -translate-y-1/2 w-20 h-20 text-indigo-400/10 group-hover:scale-110 group-hover:text-indigo-400/20 transition-all duration-500" />
                    <span className="text-[11px] text-indigo-400/80 font-bold block mb-1">القطاعات المغطاة</span>
                    <span className="text-3xl font-black text-indigo-400">
                      {new Set(teams.map(t => t.sector)).size}
                    </span>
                  </div>
                </div>"""
                
    if admin_top_stats_old in admin_code:
        admin_code = admin_code.replace(admin_top_stats_old, admin_top_stats_new)
        if 'MapPin' not in admin_code:
            admin_code = admin_code.replace('Info } from', 'Info, Users, CheckCircle, Ban, MapPin } from')

    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(admin_code)


    # ----------------------------------------------------
    # 3. LabDashboard.jsx
    # ----------------------------------------------------
    with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
        lab_code = f.read()

    # The teams grid:
    old_team_card = """                      <div key={team.id} className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{team.name}</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-black text-slate-800 dark:text-white">{teamSamplesCount}</span>
                          <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">عينة</span>

                        </div>
                      </div>"""
    
    new_team_card = """                      <div key={team.id} className="relative overflow-hidden group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/50 flex flex-col gap-2 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                        <Users className="absolute top-1/2 left-2 -translate-y-1/2 w-16 h-16 text-white/5 group-hover:scale-110 group-hover:text-white/10 transition-all duration-500" />
                        <span className="text-xs font-bold text-slate-300 z-10">{team.name}</span>
                        <div className="flex items-end justify-between z-10 mt-1">
                          <span className="text-3xl font-black text-white">{teamSamplesCount}</span>
                          <span className="text-[10px] text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded-full font-bold border border-teal-500/30">عينة واردة</span>
                        </div>
                      </div>"""
                      
    lab_code = lab_code.replace(old_team_card, new_team_card)
    if 'Users' not in lab_code:
        lab_code = lab_code.replace('FlaskConical } from', 'FlaskConical, Users } from')

    with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
        f.write(lab_code)


    # ----------------------------------------------------
    # 4. AccountantPanel.jsx
    # ----------------------------------------------------
    with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
        acc_code = f.read()
        
    # Remove dev button
    dev_button_regex = r'<button[^>]*>\s*\[Dev\] توليد وصولات مسددة\s*</button>'
    acc_code = re.sub(dev_button_regex, '', acc_code)

    # Change buttons to gradient animated cards
    old_acc_cards = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setSelectedReportType("monthly")}
                className="text-right bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors shadow-sm"
              >
                <span className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  الإيرادات المحصلة (هذا الشهر)
                </span>
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {sectorMonthlyRevenue.toLocaleString()}{" "}
                  <span className="text-[10px]">د.ع</span>
                </span>
                <span className="text-[10px] text-emerald-500 mt-2 block flex items-center gap-1">
                  <Search className="w-3 h-3" /> عرض التفاصيل
                </span>
              </button>
              <button
                onClick={() => setSelectedReportType("total")}
                className="text-right bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 p-5 rounded-2xl hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors shadow-sm"
              >
                <span className="block text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">
                  إجمالي الإيرادات (الكلية)
                </span>
                <span className="block text-2xl font-black text-teal-700 dark:text-teal-300">
                  {sectorTotalRevenue.toLocaleString()}{" "}
                  <span className="text-[10px]">د.ع</span>
                </span>
                <span className="text-[10px] text-teal-500 mt-2 block flex items-center gap-1">
                  <Search className="w-3 h-3" /> عرض التفاصيل
                </span>
              </button>

              <button
                onClick={() => setSelectedReportType("pending")}
                className="text-right bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-5 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shadow-sm"
              >
                <span className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                  الغرامات المعلقة (قيد التسديد)
                </span>
                <span className="block text-2xl font-black text-red-700 dark:text-red-300">
                  {sectorPendingAmount.toLocaleString()}{" "}
                  <span className="text-[10px]">د.ع</span>
                </span>
                <span className="text-[10px] text-red-500 mt-2 block flex items-center gap-1">
                  <Search className="w-3 h-3" /> عرض التفاصيل
                </span>
              </button>
            </div>"""
            
    new_acc_cards = """            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() => setSelectedReportType("monthly")}
                className="group relative overflow-hidden text-right bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-800/40 p-5 rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-xl"
              >
                <Banknote className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-400/10 group-hover:scale-110 group-hover:text-emerald-400/20 transition-all duration-500" />
                <span className="block text-xs font-bold text-emerald-400/80 mb-1 relative z-10">
                  الإيرادات المحصلة (هذا الشهر)
                </span>
                <span className="block text-3xl font-black text-emerald-400 relative z-10">
                  {sectorMonthlyRevenue.toLocaleString()}{" "}
                  <span className="text-[12px] font-bold">د.ع</span>
                </span>
                <span className="text-[10px] text-emerald-400/60 mt-3 block flex items-center gap-1 relative z-10 bg-emerald-500/10 w-fit px-2 py-1 rounded-lg">
                  <Search className="w-3 h-3" /> عرض التفاصيل
                </span>
              </button>
              <button
                onClick={() => setSelectedReportType("total")}
                className="group relative overflow-hidden text-right bg-gradient-to-br from-teal-900 to-slate-900 border border-teal-800/40 p-5 rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-xl"
              >
                <Wallet className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-teal-400/10 group-hover:scale-110 group-hover:text-teal-400/20 transition-all duration-500" />
                <span className="block text-xs font-bold text-teal-400/80 mb-1 relative z-10">
                  إجمالي الإيرادات (الكلية)
                </span>
                <span className="block text-3xl font-black text-teal-400 relative z-10">
                  {sectorTotalRevenue.toLocaleString()}{" "}
                  <span className="text-[12px] font-bold">د.ع</span>
                </span>
                <span className="text-[10px] text-teal-400/60 mt-3 block flex items-center gap-1 relative z-10 bg-teal-500/10 w-fit px-2 py-1 rounded-lg">
                  <Search className="w-3 h-3" /> عرض التفاصيل
                </span>
              </button>

              <button
                onClick={() => setSelectedReportType("pending")}
                className="group relative overflow-hidden text-right bg-gradient-to-br from-red-900 to-slate-900 border border-red-800/40 p-5 rounded-2xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 shadow-xl"
              >
                <AlertCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-red-400/10 group-hover:scale-110 group-hover:text-red-400/20 transition-all duration-500" />
                <span className="block text-xs font-bold text-red-400/80 mb-1 relative z-10">
                  الغرامات المعلقة (قيد التسديد)
                </span>
                <span className="block text-3xl font-black text-red-400 relative z-10">
                  {sectorPendingAmount.toLocaleString()}{" "}
                  <span className="text-[12px] font-bold">د.ع</span>
                </span>
                <span className="text-[10px] text-red-400/60 mt-3 block flex items-center gap-1 relative z-10 bg-red-500/10 w-fit px-2 py-1 rounded-lg">
                  <Search className="w-3 h-3" /> عرض التفاصيل
                </span>
              </button>
            </div>"""
    
    acc_code = acc_code.replace(old_acc_cards, new_acc_cards)
    if 'Banknote' not in acc_code:
        acc_code = acc_code.replace('Search } from', 'Search, Banknote, Wallet, AlertCircle } from')
        
    with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(acc_code)

    print("Success!")

if __name__ == '__main__':
    main()
