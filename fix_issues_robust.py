import re
import os

# 1. ExecutivePortal.jsx
with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix targetRecipient
if 'value="accountant"' not in content:
    content = re.sub(
        r'(<select\s+value=\{targetRecipient\}[\s\S]*?<option key=\{t\.id\} value=\{t\.id\}>👥 \{t\.name\} \(\{t\.sector\}\)</option>\s*\n\s*\}\)\})',
        r'\1\n                      <option value="accountant">💰 المحاسب المالي</option>\n                      <option value="lab">🧪 مختبر الصحة المركزي</option>\n                      {trackers && trackers.map(tr => (\n                        <option key={tr.id} value={tr.id}>🕵️ المتابع: {tr.name}</option>\n                      ))}',
        content
    )

# Fix QuickTeamDispatch UI
if 'list={"estList-"' not in content:
    old_ui = r'<select\s+onChange=\{\(e\) => \{\s+setDispatchEstId\(e\.target\.value\);\s+setDispatchTeamId\(t\.id\);\s+\}\}\s+className="[^"]*"\s*>\s*<option value="">-- اختر المنشأة --</option>\s*\{establishments\.filter\(e => e\.sector === t\.sector\)\.map\(est => \(\s*<option key=\{est\.id\} value=\{est\.id\}>\{est\.name\}</option>\s*\)\)\}\s*</select>'
    new_ui = r"""<input
                            type="text"
                            list={"estList-" + t.id}
                            placeholder="ابحث عن المنشأة..."
                            onChange={(e) => {
                              const est = establishments.find(es => es.name === e.target.value);
                              if (est) {
                                setDispatchEstId(est.id);
                                setDispatchTeamId(t.id);
                              }
                            }}
                            className="w-full mb-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]"
                          />
                          <datalist id={"estList-" + t.id}>
                            {establishments.filter(e => e.sector === t.sector).map(est => (
                              <option key={est.id} value={est.name} />
                            ))}
                          </datalist>
                          <input
                            type="text"
                            placeholder="ملاحظات التوجيه..."
                            value={dispatchTeamId === t.id ? dispatchNote : ""}
                            onChange={(e) => { setDispatchNote(e.target.value); setDispatchTeamId(t.id); }}
                            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]"
                          />"""
    content = re.sub(old_ui, new_ui, content)
    
    # Fix the handleDispatch button call
    content = re.sub(
        r'handleDispatch\(dispatchTeamId \|\| t\.id,\s*dispatchEstId\)',
        r'handleDispatch(dispatchTeamId || t.id, dispatchEstId, dispatchNote)',
        content
    )

with open('src/pages/ExecutivePortal.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. TeamDashboard.jsx
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix targetRecipient
if 'value="accountant"' not in content:
    content = re.sub(
        r'(<select\s+value=\{targetRecipient\}[\s\S]*?<option key=\{t\.id\} value=\{t\.id\}>👥 \{t\.name\} \(\{t\.sector\}\)</option>\s*\n\s*\}\)\})',
        r'\1\n                      <option value="accountant">💰 المحاسب المالي</option>\n                      <option value="lab">🧪 مختبر الصحة المركزي</option>\n                      {trackers && trackers.map(tr => (\n                        <option key={tr.id} value={tr.id}>🕵️ المتابع: {tr.name}</option>\n                      ))}',
        content
    )

# Hide QR button for non-team users
if '{user?.role === \'team\' && (' not in content:
    content = re.sub(
        r'(<button\s+onClick=\{\(\) => setShowQRScanner\(true\)\}\s+className="glassmorphic-card p-4 border border-teal-500/20 hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 font-black text-teal-600 dark:text-teal-400"\s*>\s*<QrCode className="w-5 h-5 animate-pulse" />\s*<span>مسح كود QR لمنشأة 📸</span>\s*</button>)',
        r'{user?.role === "team" && (\n              \1\n              )}',
        content
    )

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 3. AccountantPanel.jsx Animated Icons
with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'group overflow-hidden relative' not in content:
    content = re.sub(
        r'(className="glassmorphic-card p-5 border border-emerald-500/20")(\s*>\s*)(<h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">إجمالي الإيرادات المسجلة</h3>)',
        r'className="glassmorphic-card p-5 border border-emerald-500/20 group overflow-hidden relative"\2<div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-500/5 dark:text-emerald-400/5 group-hover:scale-110 group-hover:text-emerald-500/10 transition-all duration-500 pointer-events-none"><DollarSign className="w-full h-full" /></div>\n            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">إجمالي الإيرادات المسجلة</h3>',
        content
    )
    content = re.sub(
        r'(className="glassmorphic-card p-5 border border-amber-500/20")(\s*>\s*)(<h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">الإيرادات المحصلة اليوم</h3>)',
        r'className="glassmorphic-card p-5 border border-amber-500/20 group overflow-hidden relative"\2<div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-amber-500/5 dark:text-amber-400/5 group-hover:scale-110 group-hover:text-amber-500/10 transition-all duration-500 pointer-events-none"><TrendingUp className="w-full h-full" /></div>\n            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">الإيرادات المحصلة اليوم</h3>',
        content
    )
    content = re.sub(
        r'(className="glassmorphic-card p-5 border border-rose-500/20")(\s*>\s*)(<h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">الغرامات غير المسددة</h3>)',
        r'className="glassmorphic-card p-5 border border-rose-500/20 group overflow-hidden relative"\2<div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-rose-500/5 dark:text-rose-400/5 group-hover:scale-110 group-hover:text-rose-500/10 transition-all duration-500 pointer-events-none"><AlertCircle className="w-full h-full" /></div>\n            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">الغرامات غير المسددة</h3>',
        content
    )
    content = re.sub(
        r'(className="glassmorphic-card p-5 border border-blue-500/20")(\s*>\s*)(<h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">إجمالي الغرامات المرفوعة</h3>)',
        r'className="glassmorphic-card p-5 border border-blue-500/20 group overflow-hidden relative"\2<div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-blue-500/5 dark:text-blue-400/5 group-hover:scale-110 group-hover:text-blue-500/10 transition-all duration-500 pointer-events-none"><FileText className="w-full h-full" /></div>\n            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">إجمالي الغرامات المرفوعة</h3>',
        content
    )

if 'TrendingUp' not in content:
    content = content.replace("from 'lucide-react';", ", TrendingUp } from 'lucide-react';")

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied with regex.")
