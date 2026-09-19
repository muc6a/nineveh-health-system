import sys

def update_lab():
    file_path = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/LabDashboard.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_lab = """                      <div key={team.id} className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{team.name}</span>
                        <div className="flex items-end justify-between">
                          <span className="text-2xl font-black text-slate-800 dark:text-white">{teamSamplesCount}</span>
                          <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">عينة</span>
                        </div>
                      </div>"""
    
    new_lab = """                      <div key={team.id} className="relative overflow-hidden group bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-2 shadow-sm hover:shadow-md transition-all">
                        <Users className="absolute top-1/2 left-2 -translate-y-1/2 w-16 h-16 text-slate-100 dark:text-slate-700/30 group-hover:scale-110 group-hover:text-teal-500/10 transition-all duration-500 pointer-events-none" />
                        <div className="relative z-10 flex flex-col gap-2">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{team.name}</span>
                          <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-slate-800 dark:text-white">{teamSamplesCount}</span>
                            <span className="text-[10px] text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full font-bold">عينة</span>
                          </div>
                        </div>
                      </div>"""
    
    if old_lab in content:
        content = content.replace(old_lab, new_lab)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated LabDashboard.jsx")
    else:
        print("Warning: old_lab not found in LabDashboard.jsx")

def update_accountant_btn():
    file_path = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/AccountantPanel.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Need to regex or exactly match the big test button and remove it.
    import re
    # We'll match from <button onClick={() => { const testFines ... to `</button>`
    # The string might vary, let's use a regex to match the button with `[Dev]`
    pattern = r'<button[^>]*onClick=\{\(\)\s*=>\s*\{\s*const testFines.*?</button>'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Removed test button from AccountantPanel.jsx")

def update_accountant_cards():
    file_path = '/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/pages/AccountantPanel.jsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The cards are:
    old_card_1 = """                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-2xl text-center">"""
    new_card_1 = """                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-6 rounded-2xl text-center relative overflow-hidden group">
                  <Banknote className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-emerald-400/10 group-hover:scale-110 group-hover:text-emerald-400/20 transition-all duration-500 pointer-events-none" />"""

    old_card_2 = """                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-6 rounded-2xl text-center">"""
    new_card_2 = """                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-6 rounded-2xl text-center relative overflow-hidden group">
                  <CreditCard className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-indigo-400/10 group-hover:scale-110 group-hover:text-indigo-400/20 transition-all duration-500 pointer-events-none" />"""

    if old_card_1 in content:
        content = content.replace(old_card_1, new_card_1)
    if old_card_2 in content:
        content = content.replace(old_card_2, new_card_2)

    # also find any other big stat cards in dashboard view, like:
    old_card_3 = """                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">"""
    new_card_3 = """                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center relative overflow-hidden group">
                  <Activity className="absolute top-1/2 left-4 -translate-y-1/2 w-24 h-24 text-slate-100 dark:text-slate-800/50 group-hover:scale-110 group-hover:text-teal-500/10 transition-all duration-500 pointer-events-none" />"""
    
    if old_card_3 in content:
        content = content.replace(old_card_3, new_card_3)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated AccountantPanel cards")

def main():
    update_lab()
    update_accountant_btn()
    update_accountant_cards()

if __name__ == '__main__':
    main()
