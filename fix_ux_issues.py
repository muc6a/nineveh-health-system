import os

widget_path = "src/components/LiveSupportWidget.jsx"
sidebar_path = "src/components/UnifiedSidebar.jsx"

with open(widget_path, 'r') as f:
    widget_content = f.read()

# 1. Add central_director and director explicitly for operations
if "roles.push({ id: 'central_director', label: 'مدير الرقابة المركزية', sector: 'all' });" not in widget_content:
    widget_content = widget_content.replace(
"""  if (!isOperations) {
    roles.push({ id: 'operations', label: 'الإدارة المركزية', sector: 'all' });
  } else {
    // If operations, we should see other operations users?
    // Wait, let's just make sure central_director is visible to director and vice versa.
    // The user wants 'central_director' to appear in the list for 'director'.
  }""",
"""  if (!isOperations) {
    roles.push({ id: 'operations', label: 'الإدارة المركزية', sector: 'all' });
  } else {
    if (user?.role === 'director' || user?.role === 'admin') {
      roles.push({ id: 'central_director', label: 'مدير الرقابة المركزية', sector: 'all' });
    }
    if (user?.role === 'central_director' || user?.role === 'admin') {
      roles.push({ id: 'director', label: 'مدير عام صحة نينوى', sector: 'all' });
    }
  }""")

# 2. Fix ChatWidget message display name to include role name
if "msg.senderRole === 'central_director' ? 'مدير الرقابة المركزية'" not in widget_content:
    widget_content = widget_content.replace(
        "{msg.senderId !== user?.id && <span className=\"block text-[10px] font-bold text-teal-600 mb-1\">{msg.senderName}</span>}",
        "{msg.senderId !== user?.id && <span className=\"block text-[10px] font-bold text-teal-600 mb-1\">{msg.senderName} - {msg.senderRole === 'central_director' ? 'مدير الرقابة المركزية' : msg.senderRole === 'director' ? 'مدير عام صحة نينوى' : msg.senderRole === 'admin' ? 'مدير النظام' : msg.senderRole === 'financial_accountant' ? 'محاسب' : msg.senderRole === 'team_leader' ? 'مدير فريق' : 'الإدارة المركزية'}</span>}"
    )

# 3. Fix chat isolation logic to support explicit ops-to-ops chat
old_logic = """      if (targetRole === 'operations') {
        // Chatting with other operations (if supported)
        return msg.targetRole === 'operations' && msgSenderOps;
      } else {
        // Chatting with a specific user
        return (msg.senderId === targetRole && (msg.targetRole === 'operations' || msg.targetRole === user?.id)) ||
               (msgSenderOps && msg.targetRole === targetRole);
      }"""
new_logic = """      if (targetRole === 'operations') {
        return msg.targetRole === 'operations' && msgSenderOps;
      } else if (targetRole === 'central_director' || targetRole === 'director') {
        // Ops talking specifically to another Ops role
        return (msg.senderRole === targetRole && (msg.targetRole === user?.role || msg.targetRole === 'operations' || msg.targetRole === user?.id)) || 
               (msg.senderRole === user?.role && (msg.targetRole === targetRole || msg.targetRole === 'operations' || msg.targetRole === user?.id));
      } else {
        // Chatting with a normal user
        return (msg.senderId === targetRole && (msg.targetRole === 'operations' || msg.targetRole === user?.role || msg.targetRole === user?.id)) ||
               (msgSenderOps && msg.targetRole === targetRole);
      }"""
if new_logic not in widget_content:
    widget_content = widget_content.replace(old_logic, new_logic)

with open(widget_path, 'w') as f:
    f.write(widget_content)

# Now fix the sidebar grouping
with open(sidebar_path, 'r') as f:
    sidebar_content = f.read()

# Replace the complex lab and finance grouping logic with a simple flat render, OR implement the dropdown.
# The user wants to see the items. Flattening it is the most reliable.

sidebar_flat = """    visibleTabs.forEach(tab => {
      elements.push(renderTabButton(tab));
    });"""

old_sidebar_render = """    visibleTabs.forEach(tab => {
      if (labKeys.includes(tab.id)) {
        if (!labRendered) {
          labRendered = true;
          if (labTabs.length > 1) {
             const isLabActive = labTabs.some(t => t.id === activeTab);
             elements.push(
                <button
                  key="group_lab"
                  onClick={() => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab(labTabs[0].id); if (window.location.pathname !== '/dashboard/lab' && navigate) navigate('/dashboard/lab?tab=' + labTabs[0].id); setIsSidebarOpen(false); }}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${isLabActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
                >
                  <FlaskConical className={`w-5 h-5 ${isLabActive ? '' : 'text-indigo-500'}`} />
                  <span>قسم المختبر</span>
                </button>
             );
          } else {
             elements.push(renderTabButton(tab));
          }
        }
      } else if (financeKeys.includes(tab.id)) {
        if (!financeRendered) {
          financeRendered = true;
          if (financeTabs.length > 1) {
             const isFinanceActive = financeTabs.some(t => t.id === activeTab);
             elements.push(
                <button
                  key="group_finance"
                  onClick={() => { if(setExecutiveTab) setExecutiveTab('dashboard'); setActiveTab(financeTabs[0].id); if (window.location.pathname !== '/dashboard/accountant' && navigate) navigate('/dashboard/accountant?tab=' + financeTabs[0].id); setIsSidebarOpen(false); }}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${isFinanceActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
                >
                  <LayoutDashboard className={`w-5 h-5 ${isFinanceActive ? '' : 'text-emerald-500'}`} />
                  <span>القسم المالي</span>
                </button>
             );
          } else {
             elements.push(renderTabButton(tab));
          }
        }
      } else {
        elements.push(renderTabButton(tab));
      }
    });"""

if old_sidebar_render in sidebar_content:
    sidebar_content = sidebar_content.replace(old_sidebar_render, sidebar_flat)

with open(sidebar_path, 'w') as f:
    f.write(sidebar_content)

print("Done fixing UX issues")
