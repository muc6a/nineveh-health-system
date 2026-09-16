import sys

def update_team_dashboard():
    file_path = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/TeamDashboard.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Card 1
    old_card_1 = """              <div
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-teal-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">إجمالي المنشآت المخصصة للجنة</span>"""
    new_card_1 = """              <div
                onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-teal-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
              >
                <Building className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-teal-400/10 group-hover:scale-110 group-hover:text-teal-400/20 transition-all duration-500 pointer-events-none" />
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 relative z-10">إجمالي المنشآت المخصصة للجنة</span>"""
    
    # Card 2
    old_card_2 = """              <div
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-emerald-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت تم زيارتها بنجاح هذا الشهر 🟢</span>"""
    new_card_2 = """              <div
                onClick={() => { setMetricModalType('inspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-emerald-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
              >
                <CheckCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-400/10 group-hover:scale-110 group-hover:text-emerald-400/20 transition-all duration-500 pointer-events-none" />
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 relative z-10">منشآت تم زيارتها بنجاح هذا الشهر 🟢</span>"""

    # Card 3
    old_card_3 = """              <div
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-red-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer select-none"
              >
                <span className="text-xs font-black text-slate-500 dark:text-slate-400">منشآت متأخرة بانتظار الزيارة الفورية 🔴</span>"""
    new_card_3 = """              <div
                onClick={() => { setMetricModalType('uninspected'); setShowMetricModal(true); }}
                className="glassmorphic-card p-5 border border-red-500/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
              >
                <AlertTriangle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-red-400/10 group-hover:scale-110 group-hover:text-red-400/20 transition-all duration-500 pointer-events-none" />
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 relative z-10">منشآت متأخرة بانتظار الزيارة الفورية 🔴</span>"""

    if old_card_1 in content:
        content = content.replace(old_card_1, new_card_1)
    if old_card_2 in content:
        content = content.replace(old_card_2, new_card_2)
    if old_card_3 in content:
        content = content.replace(old_card_3, new_card_3)
        
    # Also add z-10 to the numbers and sub-texts of the cards so they appear above background
    content = content.replace('<p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mt-3">{totalShops}</p>', '<p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 mt-3 relative z-10">{totalShops}</p>')
    content = content.replace('<span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>', '<span className="text-[10px] text-teal-500 font-bold block mt-2 relative z-10">انقر للتفاصيل 👁️</span>')

    content = content.replace('<p className="text-4xl font-extrabold text-emerald-500 mt-3">{inspectedShops}</p>', '<p className="text-4xl font-extrabold text-emerald-500 mt-3 relative z-10">{inspectedShops}</p>')
    content = content.replace('<span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>', '<span className="text-[10px] text-emerald-500 font-bold block mt-2 relative z-10">انقر للتفاصيل 👁️</span>')

    content = content.replace('<p className="text-4xl font-extrabold text-red-500 mt-3">{uninspectedShops}</p>', '<p className="text-4xl font-extrabold text-red-500 mt-3 relative z-10">{uninspectedShops}</p>')
    content = content.replace('<span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>', '<span className="text-[10px] text-red-500 font-bold block mt-2 relative z-10">انقر للتفاصيل 👁️</span>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated TeamDashboard cards")

if __name__ == '__main__':
    update_team_dashboard()
