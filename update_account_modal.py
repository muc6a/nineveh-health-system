import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/AccountModal.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# For AccountModal, the form wraps everything inside the scrollable div.
# We will change it so the form wraps the entire modal inner content.
# Wait, if we change the form wrapper, it's a bit complex. Let's just use Python to find and replace.

target1 = """        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8 text-sm font-bold text-right flex flex-col min-h-full">"""
replacement1 = """        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-sm font-bold text-right">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">"""
content = content.replace(target1, replacement1)

target2 = """            <div className="mt-auto pt-6 pb-2 shrink-0 border-t border-slate-200 dark:border-white/5 sticky bottom-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-20 -mx-6 px-6">
              <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3">
                <Check className="w-5 h-5"/>
                {mode === 'add' ? 'إنشاء الحساب' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        </div>"""
replacement2 = """          </div>
          {/* STICKY FOOTER OUTSIDE SCROLL AREA */}
          <div className="shrink-0 p-4 md:p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-20 rounded-b-[2rem]">
            <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
              <Check className="w-5 h-5"/>
              {mode === 'add' ? 'إنشاء الحساب' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>"""
content = content.replace(target2, replacement2)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AccountModal.jsx layout")
