import re
import os

# 1. & 3. TeamDashboard.jsx
with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix QRScannerModal Buttons
if '!embeddedTab && user?.role === "team"' not in content:
    content = re.sub(
        r'(<button\s+onClick=\{\(\) => setShowQRScanner\(true\)\}\s+className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg shadow-teal-500/20 flex items-center gap-2 font-black transition-all active:scale-95 w-full md:w-auto justify-center"\s*>\s*<QrCode className="w-5 h-5" />\s*<span>(.*?)📸</span>\s*</button>)',
        r'{(!embeddedTab && user?.role === "team") && (\n              \1\n              )}',
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

    # Add dispatchNote state if not exists
    if 'const [dispatchNote, setDispatchNote]' not in content:
        content = content.replace(
            "const [dispatchEstId, setDispatchEstId] = useState('');",
            "const [dispatchEstId, setDispatchEstId] = useState('');\n  const [dispatchNote, setDispatchNote] = useState('');\n  const [dispatchTeamId, setDispatchTeamId] = useState('');"
        )
    
    # Fix handleDispatch function declaration
    if 'const handleDispatch = (tId, eId, note) =>' not in content:
        content = content.replace(
            "const handleDispatch = (tId, eId) => {",
            "const handleDispatch = (tId, eId, note) => {"
        )
        content = content.replace(
            "    notify('تم إرسال التوجيه للفريق الميداني بنجاح', 'success');",
            """    setTasks(prev => [{
      id: 'tsk_' + Date.now(),
      type: 'visit',
      title: 'زيارة فورية موجهة',
      desc: `تم توجيهكم من الإدارة لزيارة المنشأة (${est.name}) فوراً. الملاحظات: ${note || 'لا توجد ملاحظات'}`,
      teamId: team.id || tId,
      status: 'pending',
      targetEstId: est.id,
      createdAt: new Date().toISOString()
    }, ...prev]);
    notify('تم إرسال التوجيه للفريق الميداني وإضافته للمهام الذكية بنجاح', 'success');"""
        )
        # We need to handle team definition since `team` isn't declared in handleDispatch
        content = content.replace(
            "const est = establishments.find(e => e.id === parseInt(eId) || e.id === eId);",
            "const est = establishments.find(e => e.id === parseInt(eId) || e.id === eId);\n    const team = teams.find(t => t.id === tId) || {};"
        )

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)


# 2. LabDashboard.jsx
with open('src/pages/LabDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if '{ id: \'incoming\', label: \'استلام العينات وتوزيعها\' }' not in content:
    content = re.sub(
        r'setActiveSidebarTabs\(\[\s*\{ id: \'stats\', label: \'الرئيسية والتقارير\' \},\s*\{ id: \'testing\', label: \'فحص العينات\' \}\s*\]\);',
        r"setActiveSidebarTabs([\n        { id: 'stats', label: 'الرئيسية والتقارير' },\n        { id: 'incoming', label: 'استلام العينات وتوزيعها' },\n        { id: 'testing', label: 'إدخال نتائج الفحص' },\n        { id: 'comprehensive_reports', label: 'التقارير المختبرية والرقابية' },\n        { id: 'archive', label: 'الأرشيف المختبري' },\n        { id: 'directives', label: 'التبليغات' }\n      ]);",
        content
    )

with open('src/pages/LabDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)


# 4. AccountantPanel.jsx Animations
with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

if 'hover:-translate-y-2' not in content:
    content = content.replace(
        'className="glassmorphic-card p-5 border border-emerald-500/20 group overflow-hidden relative"',
        'className="glassmorphic-card p-5 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] group overflow-hidden relative transition-all duration-500 hover:-translate-y-2"'
    )
    content = content.replace(
        'className="glassmorphic-card p-5 border border-amber-500/20 group overflow-hidden relative"',
        'className="glassmorphic-card p-5 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] group overflow-hidden relative transition-all duration-500 hover:-translate-y-2"'
    )
    content = content.replace(
        'className="glassmorphic-card p-5 border border-rose-500/20 group overflow-hidden relative"',
        'className="glassmorphic-card p-5 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] group overflow-hidden relative transition-all duration-500 hover:-translate-y-2"'
    )
    content = content.replace(
        'className="glassmorphic-card p-5 border border-blue-500/20 group overflow-hidden relative"',
        'className="glassmorphic-card p-5 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] group overflow-hidden relative transition-all duration-500 hover:-translate-y-2"'
    )
    
    # Make icons pulse on hover
    content = content.replace(
        'group-hover:scale-110 group-hover:text-emerald-500/10 transition-all duration-500 pointer-events-none',
        'group-hover:scale-110 group-hover:text-emerald-500/20 animate-pulse transition-all duration-500 pointer-events-none'
    )
    content = content.replace(
        'group-hover:scale-110 group-hover:text-amber-500/10 transition-all duration-500 pointer-events-none',
        'group-hover:scale-110 group-hover:text-amber-500/20 animate-pulse transition-all duration-500 pointer-events-none'
    )
    content = content.replace(
        'group-hover:scale-110 group-hover:text-rose-500/10 transition-all duration-500 pointer-events-none',
        'group-hover:scale-110 group-hover:text-rose-500/20 animate-pulse transition-all duration-500 pointer-events-none'
    )
    content = content.replace(
        'group-hover:scale-110 group-hover:text-blue-500/10 transition-all duration-500 pointer-events-none',
        'group-hover:scale-110 group-hover:text-blue-500/20 animate-pulse transition-all duration-500 pointer-events-none'
    )

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied with python script.")
