import re

with open("src/pages/LabDashboard.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace the "بوابة المختبر المركزي" with the User Profile card
sidebar_top_target = r"""<AnimatedLogo variant="sidebar" className="mb-6" />\s*<div className="space-y-1 mb-6">\s*<span className="text-\[11px\] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-3 mb-2">\s*بوابة المختبر المركزي\s*</span>"""

sidebar_top_replace = """<AnimatedLogo variant="sidebar" className="mb-6" />

          {/* User Profile */}
          <div className="mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {user?.name}
              </span>
              <span className="text-[9px] text-teal-650 dark:text-teal-400 font-extrabold uppercase mt-0.5">
                {user?.title || user?.role} {user?.sector ? ` - قطاع ${user.sector}` : ''}
              </span>
              <span className="text-[8px] text-slate-400 font-normal dir-ltr">{user?.email}</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="space-y-1 mb-6">"""

content = re.sub(sidebar_top_target, sidebar_top_replace, content)

# 2. Fix layout width from max-w-6xl to w-full max-w-full
layout_target = r'<div className="max-w-6xl mx-auto space-y-6">'
layout_replace = '<div className="w-full max-w-full mx-auto space-y-6">'
content = re.sub(layout_target, layout_replace, content)

with open("src/pages/LabDashboard.jsx", "w", encoding="utf-8") as f:
    f.write(content)
