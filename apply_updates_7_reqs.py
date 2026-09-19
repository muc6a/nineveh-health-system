import os

def update_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"Warning: Could not find substring in {path}: {old[:50]}...")
            
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {path}")

# 1. & 2. & 3. Executive Portal Updates
# - Add accountant, lab, trackers to targetRecipient options
# - Quick Team Dispatch: Change select to input+datalist, add dispatchNote, update handleDispatch
exec_path = 'src/pages/ExecutivePortal.jsx'
with open(exec_path, 'r', encoding='utf-8') as f:
    exec_content = f.read()

# Update handleDispatch to accept notes and push to tasks
if 'const handleDispatch = (tId, eId) => {' in exec_content:
    exec_content = exec_content.replace(
        'const handleDispatch = (tId, eId) => {',
        'const [dispatchNote, setDispatchNote] = useState("");\n  const handleDispatch = (tId, eId, note) => {'
    )
    exec_content = exec_content.replace(
        """    setDispatches(prev => [...prev, {
      id: 'disp_' + Date.now(),
      estId: est.id,
      estName: est.name,
      teamId: team.id,
      date: new Date().toISOString(),
      status: 'pending'

    }]);""",
        """    setDispatches(prev => [...prev, {
      id: 'disp_' + Date.now(),
      estId: est.id,
      estName: est.name,
      teamId: team.id,
      date: new Date().toISOString(),
      status: 'pending'
    }]);
    
    setTasks(prev => [{
      id: 'tsk_' + Date.now(),
      type: 'visit',
      title: 'زيارة فورية موجهة',
      desc: `تم توجيهكم من الغرفة المركزية لزيارة المنشأة (${est.name}) فوراً. الملاحظات: ${note || 'لا توجد ملاحظات'}`,
      teamId: team.id,
      status: 'pending',
      targetEstId: est.id,
      createdAt: new Date().toISOString()
    }, ...prev]);"""
    )
    
# Quick dispatch UI changes (datalist and notes input)
old_dispatch_ui = """                        <td className="p-3">
                          <select
                            onChange={(e) => {
                              setDispatchEstId(e.target.value);
                              setDispatchTeamId(t.id);
                            }}
                            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px]"
                          >
                            <option value="">-- اختر المنشأة --</option>
                            {establishments.filter(e => e.sector === t.sector).map(est => (
                              <option key={est.id} value={est.id}>{est.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDispatch(dispatchTeamId || t.id, dispatchEstId)}"""

new_dispatch_ui = """                        <td className="p-3">
                          <input
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
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDispatch(dispatchTeamId || t.id, dispatchEstId, dispatchNote)}"""

exec_content = exec_content.replace(old_dispatch_ui, new_dispatch_ui)

# targetRecipient options updates in ExecutivePortal
old_recipient_options = """                      {allowedTeams.map(t => (
                        <option key={t.id} value={t.id}>👥 {t.name} ({t.sector})</option>
                      ))}

                    </select>"""
new_recipient_options = """                      {allowedTeams.map(t => (
                        <option key={t.id} value={t.id}>👥 {t.name} ({t.sector})</option>
                      ))}
                      <option value="accountant">💰 المحاسب المالي</option>
                      <option value="lab">🧪 مختبر الصحة المركزي</option>
                      {trackers && trackers.map(tr => (
                        <option key={tr.id} value={tr.id}>🕵️ المتابع: {tr.name}</option>
                      ))}
                    </select>"""
exec_content = exec_content.replace(old_recipient_options, new_recipient_options)

with open(exec_path, 'w', encoding='utf-8') as f:
    f.write(exec_content)
print("Updated ExecutivePortal.jsx")

# 4. Print Statistical Report - index.css
with open('src/index.css', 'a', encoding='utf-8') as f:
    f.write("""
@media print {
  body { background: white !important; color: black !important; margin: 0; padding: 0; }
  .no-print, aside, header, nav, button { display: none !important; }
  main { margin: 0 !important; padding: 0 !important; width: 100% !important; overflow: visible !important; }
  .glassmorphic-card { border: 1px solid #ccc !important; box-shadow: none !important; background: transparent !important; page-break-inside: avoid; margin-bottom: 20px; }
  .grid { display: block !important; }
  * { color: black !important; }
  canvas, svg { max-width: 100% !important; }
}
""")
print("Updated index.css for printing")

# 3. QRScannerModal - Camera default
qr_path = 'src/components/QRScannerModal.jsx'
update_file(qr_path, [
    ('{ fps: 10, qrbox: { width: 250, height: 250 } },', '{ fps: 10, qrbox: { width: 250, height: 250 }, videoConstraints: { facingMode: "environment" } },')
])

# Remove QR button from TeamDashboard if embedded (or check user role)
team_path = 'src/pages/TeamDashboard.jsx'
with open(team_path, 'r', encoding='utf-8') as f:
    team_content = f.read()

# Add accountant, lab, trackers to targetRecipient options in TeamDashboard as well
if '<option value="all">📢 كافة شعب ولجان التفتيش بالمحافظة</option>' in team_content:
    old_team_options = """                      {directors?.filter(d => d.active).map(d => (
                        <option key={d.id} value={d.id}>👑 {d.title} ({d.name})</option>
                      ))}
                      {teams.filter(t => t.id !== user?.id).map(t => (
                        <option key={t.id} value={t.id}>👥 {t.name} ({t.sector})</option>
                      ))}
                    </select>"""
    new_team_options = """                      {directors?.filter(d => d.active).map(d => (
                        <option key={d.id} value={d.id}>👑 {d.title} ({d.name})</option>
                      ))}
                      {teams.filter(t => t.id !== user?.id).map(t => (
                        <option key={t.id} value={t.id}>👥 {t.name} ({t.sector})</option>
                      ))}
                      <option value="accountant">💰 المحاسب المالي</option>
                      <option value="lab">🧪 مختبر الصحة المركزي</option>
                      {trackers && trackers.map(tr => (
                        <option key={tr.id} value={tr.id}>🕵️ المتابع: {tr.name}</option>
                      ))}
                    </select>"""
    team_content = team_content.replace(old_team_options, new_team_options)

# Hide QR button for non-team/admin roles
if 'onClick={() => setShowQRScanner(true)}' in team_content:
    qr_button = """              <button
                onClick={() => setShowQRScanner(true)}
                className="glassmorphic-card p-4 border border-teal-500/20 hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 font-black text-teal-600 dark:text-teal-400"
              >
                <QrCode className="w-5 h-5 animate-pulse" />
                <span>مسح كود QR لمنشأة 📸</span>
              </button>"""
    new_qr_button = """              {user?.role === 'team' && (
              <button
                onClick={() => setShowQRScanner(true)}
                className="glassmorphic-card p-4 border border-teal-500/20 hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 font-black text-teal-600 dark:text-teal-400"
              >
                <QrCode className="w-5 h-5 animate-pulse" />
                <span>مسح كود QR لمنشأة 📸</span>
              </button>
              )}"""
    team_content = team_content.replace(qr_button, new_qr_button)

with open(team_path, 'w', encoding='utf-8') as f:
    f.write(team_content)
print("Updated TeamDashboard.jsx")

# 7. AccountantPanel.jsx Animated Icons
acc_path = 'src/pages/AccountantPanel.jsx'
with open(acc_path, 'r', encoding='utf-8') as f:
    acc_content = f.read()

# I will add group class and hover effects to the stats cards
acc_stat_old = """className="glassmorphic-card p-5 border border-emerald-500/20"
          >
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">إجمالي الإيرادات المسجلة</h3>"""
acc_stat_new = """className="glassmorphic-card p-5 border border-emerald-500/20 group overflow-hidden relative"
          >
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-500/5 dark:text-emerald-400/5 group-hover:scale-110 group-hover:text-emerald-500/10 transition-all duration-500 pointer-events-none">
              <DollarSign className="w-full h-full" />
            </div>
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">إجمالي الإيرادات المسجلة</h3>"""
acc_content = acc_content.replace(acc_stat_old, acc_stat_new)

acc_stat_old2 = """className="glassmorphic-card p-5 border border-amber-500/20"
          >
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">الإيرادات المحصلة اليوم</h3>"""
acc_stat_new2 = """className="glassmorphic-card p-5 border border-amber-500/20 group overflow-hidden relative"
          >
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-amber-500/5 dark:text-amber-400/5 group-hover:scale-110 group-hover:text-amber-500/10 transition-all duration-500 pointer-events-none">
              <TrendingUp className="w-full h-full" />
            </div>
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">الإيرادات المحصلة اليوم</h3>"""
acc_content = acc_content.replace(acc_stat_old2, acc_stat_new2)

acc_stat_old3 = """className="glassmorphic-card p-5 border border-rose-500/20"
          >
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">الغرامات غير المسددة</h3>"""
acc_stat_new3 = """className="glassmorphic-card p-5 border border-rose-500/20 group overflow-hidden relative"
          >
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-rose-500/5 dark:text-rose-400/5 group-hover:scale-110 group-hover:text-rose-500/10 transition-all duration-500 pointer-events-none">
              <AlertCircle className="w-full h-full" />
            </div>
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">الغرامات غير المسددة</h3>"""
acc_content = acc_content.replace(acc_stat_old3, acc_stat_new3)

acc_stat_old4 = """className="glassmorphic-card p-5 border border-blue-500/20"
          >
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2">إجمالي الغرامات المرفوعة</h3>"""
acc_stat_new4 = """className="glassmorphic-card p-5 border border-blue-500/20 group overflow-hidden relative"
          >
            <div className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-blue-500/5 dark:text-blue-400/5 group-hover:scale-110 group-hover:text-blue-500/10 transition-all duration-500 pointer-events-none">
              <FileText className="w-full h-full" />
            </div>
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 relative z-10">إجمالي الغرامات المرفوعة</h3>"""
acc_content = acc_content.replace(acc_stat_old4, acc_stat_new4)

# add lucide-react icons if not present
if "TrendingUp" not in acc_content:
    acc_content = acc_content.replace("import { DollarSign, Search, CheckCircle, Clock, Save, FileText, AlertCircle, Calendar } from 'lucide-react';", "import { DollarSign, Search, CheckCircle, Clock, Save, FileText, AlertCircle, Calendar, TrendingUp } from 'lucide-react';")

with open(acc_path, 'w', encoding='utf-8') as f:
    f.write(acc_content)
print("Updated AccountantPanel.jsx")

