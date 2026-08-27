import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/AccountModal.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Make the outer modal container flex and limit height, taking out overflow from it.
target_1 = 'relative text-right max-h-[90vh] overflow-y-auto custom-scrollbar">'
replacement_1 = 'relative text-right max-h-[90dvh] flex flex-col">'
content = content.replace(target_1, replacement_1)

target_2 = 'bg-white/50 dark:bg-slate-900/40 sticky top-0 z-20 backdrop-blur-sm">'
replacement_2 = 'bg-white/50 dark:bg-slate-900/40 z-20 backdrop-blur-sm shrink-0">'
content = content.replace(target_2, replacement_2)

# Make the form wrapper flex-1 and scrollable
target_3 = '<div className="p-6">'
replacement_3 = '<div className="p-6 overflow-y-auto flex-1 custom-scrollbar">'
content = content.replace(target_3, replacement_3)

# Make the form fill the height so the button can be stuck to bottom
target_4 = '<form onSubmit={handleSubmit} className="space-y-8 text-sm font-bold text-right">'
replacement_4 = '<form onSubmit={handleSubmit} className="space-y-8 text-sm font-bold text-right flex flex-col min-h-full">'
content = content.replace(target_4, replacement_4)

# Make the submit button sticky bottom and shrink-0
target_5 = '<button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-l'
replacement_5 = '<button type="submit" className="shrink-0 sticky bottom-0 z-10 mt-auto w-full py-4 rounded-2xl bg-gradient-to-l'
content = content.replace(target_5, replacement_5)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AccountModal.jsx")
