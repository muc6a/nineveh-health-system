import re

with open('src/pages/AccountantPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add showPayFineModal state
content = content.replace(
    "const [inventoryArchiveDate, setInventoryArchiveDate] = useState('');",
    "const [inventoryArchiveDate, setInventoryArchiveDate] = useState('');\n  const [showPayFineModal, setShowPayFineModal] = useState(false);"
)

# Replace the heading in dashboard with the heading + button
heading_pattern = r'<h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-6">\s*<LineChart className="w-5 h-5 text-emerald-500" />\s*الملخص المالي والإيرادات\s*</h3>'
new_heading = """<div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-emerald-500" />
                الملخص المالي والإيرادات
              </h3>
              <button 
                onClick={() => setShowPayFineModal(true)} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-black shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Banknote className="w-5 h-5" />
                تسديد الغرامة
              </button>
            </div>"""
content = re.sub(heading_pattern, new_heading, content)

# Change the handlePayFine to also close the modal
content = content.replace("setReceiptType('electronic');\n  };", "setReceiptType('electronic');\n    setShowPayFineModal(false);\n  };")

# Extract the pay_fines UI and put it inside a Modal
# The pay_fines tab starts at: {activeTab === 'pay_fines' && (
# Let's find it.
pay_fines_start = content.find("{activeTab === 'pay_fines' && (")
# It ends right before: {activeTab === 'directives' && (
directives_start = content.find("{activeTab === 'directives' && (")

if pay_fines_start != -1 and directives_start != -1:
    pay_fines_content = content[pay_fines_start:directives_start]
    # Wrap it in a modal
    modal_content = """{showPayFineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowPayFineModal(false)} className="absolute top-6 left-6 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
""" + pay_fines_content.replace("{activeTab === 'pay_fines' && (", "").replace("      </div>\n    </div>", "") + """
          </div>
        </div>
      )}
"""
    content = content.replace(pay_fines_content, modal_content)

# Hide the "تسديد الغرامات" button from the sidebar
content = re.sub(r'<button\s*onClick=\{\(\) => \{ setActiveTab\(\'pay_fines\'\); setIsSidebarOpen\(false\); \}\}[\s\S]*?تسديد الغرامات\s*</span>\s*</button>', '', content)

with open('src/pages/AccountantPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

