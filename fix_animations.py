import re
import os

def fix_executive_and_super_admin():
    for filename in ['ExecutivePortal.jsx', 'SuperAdminPanel.jsx']:
        filepath = f'/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/{filename}'
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find div wrappers for Card 2, 3, 4 that have `relative overflow-hidden` but missing `group`
        # Also need to make sure they have cursor-pointer or something if they hover? 
        # But `group` is what we need.
        content = content.replace(
            'text-right relative overflow-hidden"',
            'text-right relative overflow-hidden group"'
        )
        # Just in case some have spaces
        content = content.replace(
            'text-right relative overflow-hidden\n',
            'text-right relative overflow-hidden group\n'
        )
        
        # We also need to fix the two cards at the bottom: "المنشآت المغلقة هذا الشهر" and "الغرامات المالية هذا الشهر"
        # They currently have `className="glassmorphic-card p-6 border border-rose-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer select-none"`
        # Let's add icons to them too.
        
        # Monthly closures card
        old_closures = """className="glassmorphic-card p-6 border border-rose-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer select-none"
            >
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">المنشآت المغلقة هذا الشهر 🔒</h3>"""
        new_closures = """className="glassmorphic-card p-6 border border-rose-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
            >
              <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-rose-500/5 dark:text-rose-500/10 group-hover:scale-110 group-hover:text-rose-500/10 dark:group-hover:text-rose-500/20 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">المنشآت المغلقة هذا الشهر 🔒</h3>"""
        
        old_closures_end = """<span className="text-[10px] text-rose-500 font-bold block mt-3">انقر لعرض التفاصيل 👁️</span>
            </div>"""
        new_closures_end = """<span className="text-[10px] text-rose-500 font-bold block mt-3">انقر لعرض التفاصيل 👁️</span>
              </div>
            </div>"""
        
        if old_closures in content:
            content = content.replace(old_closures, new_closures)
            content = content.replace(old_closures_end, new_closures_end)
            
        # Monthly fines card
        old_fines = """className="glassmorphic-card p-6 border border-amber-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer select-none"
            >
              <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">الغرامات المالية هذا الشهر 💰</h3>"""
        new_fines = """className="glassmorphic-card p-6 border border-amber-500/20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer select-none relative overflow-hidden group"
            >
              <Banknote className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-amber-500/5 dark:text-amber-500/10 group-hover:scale-110 group-hover:text-amber-500/10 dark:group-hover:text-amber-500/20 transition-all duration-500 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2">الغرامات المالية هذا الشهر 💰</h3>"""
                
        old_fines_end = """<span className="text-[10px] text-amber-500 font-bold block mt-3">انقر لعرض التفاصيل 👁️</span>
            </div>"""
        new_fines_end = """<span className="text-[10px] text-amber-500 font-bold block mt-3">انقر لعرض التفاصيل 👁️</span>
              </div>
            </div>"""
            
        if old_fines in content:
            content = content.replace(old_fines, new_fines)
            content = content.replace(old_fines_end, new_fines_end)
            
        # Import Banknote if not imported
        if "Banknote" not in content and "lucide-react" in content:
            content = content.replace("from 'lucide-react';", ", Banknote } from 'lucide-react';")

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

def fix_operations_room():
    filepath = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/OperationsRoom.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    old_inspections = """<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 text-center">
                      <span className="block text-2xl font-black text-slate-700 dark:text-slate-200">{teamEsts.length}</span>
                      <span className="block text-[9px] font-bold text-slate-500 mt-1">الكشوفات</span>
                    </div>"""
    new_inspections = """<div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 text-center relative overflow-hidden group">
                      <ClipboardCheck className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 text-slate-900/5 dark:text-white/5 group-hover:scale-110 group-hover:text-slate-900/10 dark:group-hover:text-white/10 transition-all duration-300 pointer-events-none" />
                      <div className="relative z-10">
                        <span className="block text-2xl font-black text-slate-700 dark:text-slate-200">{teamEsts.length}</span>
                        <span className="block text-[9px] font-bold text-slate-500 mt-1">الكشوفات</span>
                      </div>
                    </div>"""
                    
    old_closures = """<div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-500/10 text-center">
                      <span className="block text-2xl font-black text-red-600">{teamClosures.length}</span>
                      <span className="block text-[9px] font-bold text-red-500 mt-1">الإغلاقات</span>
                    </div>"""
    new_closures = """<div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-500/10 text-center relative overflow-hidden group">
                      <Lock className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 text-red-500/10 dark:text-red-400/10 group-hover:scale-110 group-hover:text-red-500/20 dark:group-hover:text-red-400/20 transition-all duration-300 pointer-events-none" />
                      <div className="relative z-10">
                        <span className="block text-2xl font-black text-red-600">{teamClosures.length}</span>
                        <span className="block text-[9px] font-bold text-red-500 mt-1">الإغلاقات</span>
                      </div>
                    </div>"""
                    
    old_fines = """<div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/10 text-center">
                      <span className="block text-2xl font-black text-amber-600">{teamFines.length}</span>
                      <span className="block text-[9px] font-bold text-amber-500 mt-1">الغرامات</span>
                    </div>"""
    new_fines = """<div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-500/10 text-center relative overflow-hidden group">
                      <Banknote className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 text-amber-500/10 dark:text-amber-400/10 group-hover:scale-110 group-hover:text-amber-500/20 dark:group-hover:text-amber-400/20 transition-all duration-300 pointer-events-none" />
                      <div className="relative z-10">
                        <span className="block text-2xl font-black text-amber-600">{teamFines.length}</span>
                        <span className="block text-[9px] font-bold text-amber-500 mt-1">الغرامات</span>
                      </div>
                    </div>"""

    if old_inspections in content:
        content = content.replace(old_inspections, new_inspections)
    if old_closures in content:
        content = content.replace(old_closures, new_closures)
    if old_fines in content:
        content = content.replace(old_fines, new_fines)
        
    if "Banknote" not in content and "lucide-react" in content:
        content = content.replace("from 'lucide-react';", ", Banknote, ClipboardCheck, Lock } from 'lucide-react';")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def fix_team_dashboard():
    filepath = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/TeamDashboard.jsx'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The previous script might not have matched correctly. Let's do it with regex.
    # We want to find the divs that have `onClick={() => { setMetricModalType('all'); setShowMetricModal(true); }}`
    # and add `relative overflow-hidden group` if not present, and the background icon.
    
    # We will just do a more robust replace that will work whether it has group or not.
    # Card 1: 'all'
    if "setMetricModalType('all')" in content and "<Building2" not in content and "<Building " not in content:
        # It doesn't have the icon yet
        import re
        content = re.sub(
            r"(<div[^>]*onClick=\{\(\)\s*=>\s*\{\s*setMetricModalType\('all'\);\s*setShowMetricModal\(true\);\s*\}\}[^>]*)className=\"([^\"]*)\"([^>]*>)",
            r'\1className="\2 relative overflow-hidden group"\3\n                <Building2 className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-teal-500/5 dark:text-teal-400/5 group-hover:scale-110 group-hover:text-teal-500/10 dark:group-hover:text-teal-400/10 transition-all duration-500 pointer-events-none" />\n                <div className="relative z-10">',
            content
        )
        content = content.replace('<span className="text-[10px] text-teal-500 font-bold block mt-2 relative z-10">انقر للتفاصيل 👁️</span>\n              </div>', '<span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n                </div>\n              </div>')
        content = content.replace('<span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n              </div>', '<span className="text-[10px] text-teal-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n                </div>\n              </div>')
        
    # Card 2: 'inspected'
    if "setMetricModalType('inspected')" in content and "<CheckCircle" not in content:
        content = re.sub(
            r"(<div[^>]*onClick=\{\(\)\s*=>\s*\{\s*setMetricModalType\('inspected'\);\s*setShowMetricModal\(true\);\s*\}\}[^>]*)className=\"([^\"]*)\"([^>]*>)",
            r'\1className="\2 relative overflow-hidden group"\3\n                <CheckCircle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-500/5 dark:text-emerald-400/5 group-hover:scale-110 group-hover:text-emerald-500/10 dark:group-hover:text-emerald-400/10 transition-all duration-500 pointer-events-none" />\n                <div className="relative z-10">',
            content
        )
        content = content.replace('<span className="text-[10px] text-emerald-500 font-bold block mt-2 relative z-10">انقر للتفاصيل 👁️</span>\n              </div>', '<span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n                </div>\n              </div>')
        content = content.replace('<span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n              </div>', '<span className="text-[10px] text-emerald-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n                </div>\n              </div>')
        
    # Card 3: 'uninspected'
    if "setMetricModalType('uninspected')" in content and "<AlertTriangle" not in content:
        content = re.sub(
            r"(<div[^>]*onClick=\{\(\)\s*=>\s*\{\s*setMetricModalType\('uninspected'\);\s*setShowMetricModal\(true\);\s*\}\}[^>]*)className=\"([^\"]*)\"([^>]*>)",
            r'\1className="\2 relative overflow-hidden group"\3\n                <AlertTriangle className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-red-500/5 dark:text-red-400/5 group-hover:scale-110 group-hover:text-red-500/10 dark:group-hover:text-red-400/10 transition-all duration-500 pointer-events-none" />\n                <div className="relative z-10">',
            content
        )
        content = content.replace('<span className="text-[10px] text-red-500 font-bold block mt-2 relative z-10">انقر للتفاصيل 👁️</span>\n              </div>', '<span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n                </div>\n              </div>')
        content = content.replace('<span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n              </div>', '<span className="text-[10px] text-red-500 font-bold block mt-2">انقر للتفاصيل 👁️</span>\n                </div>\n              </div>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_executive_and_super_admin()
    fix_operations_room()
    fix_team_dashboard()
    print("Done applying fixes.")
