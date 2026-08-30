import re

file_path = "src/pages/AccountantPanel.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add isSearching state
state_target = "const [searchCode, setSearchCode] = useState('');"
state_replace = "const [searchCode, setSearchCode] = useState('');\n  const [isSearching, setIsSearching] = useState(false);"
content = content.replace(state_target, state_replace)

# 2. Add loading effect to handleSearchFine
func_target = """  const handleSearchFine = () => {
    try {"""

func_replace = """  const handleSearchFine = () => {
    if (!searchCode.trim()) {
      notify('يرجى إدخال كود المنشأة أو رقم الغرامة', 'warning');
      return;
    }
    setIsSearching(true);
    
    // Simulate HTTP Request delay to satisfy the expected UX
    setTimeout(() => {
      try {"""
content = content.replace(func_target, func_replace)

func_end_target = """      } else {
        setSearchedEstablishment(null);
        setSearchedFine(null);
        notify('المنشأة غير متوفرة في قاعدة البيانات ولم يتم العثور على غرامة مسجلة بهذا الكود', 'error');
      }
    } catch (error) {
      console.error("Search error:", error);
      notify('حدث خطأ برمجي أثناء البحث: ' + error.message, 'error');
    }
  };"""

func_end_replace = """      } else {
        setSearchedEstablishment(null);
        setSearchedFine(null);
        notify('المنشأة غير متوفرة في قاعدة البيانات ولم يتم العثور على غرامة مسجلة بهذا الكود', 'error');
      }
    } catch (error) {
      console.error("Search error:", error);
      notify('حدث خطأ برمجي أثناء البحث: ' + error.message, 'error');
    } finally {
      setIsSearching(false);
    }
    }, 800); // 800ms delay to simulate network
  };"""
content = content.replace(func_end_target, func_end_replace)

# 3. Add loading state to button and onKeyDown to input
btn_target = """                <button 
                  onClick={handleSearchFine}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  بحث واستعلام
                </button>"""

btn_replace = """                <button 
                  onClick={handleSearchFine}
                  disabled={isSearching}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSearching ? <span className="animate-spin mr-2">⏳</span> : <Search className="w-4 h-4" />}
                  {isSearching ? 'جاري البحث...' : 'بحث واستعلام'}
                </button>"""
content = content.replace(btn_target, btn_replace)

input_target = """                  onChange={(e) => setSearchCode(e.target.value.trim())}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-left"
                />"""

input_replace = """                  onChange={(e) => setSearchCode(e.target.value.trim())}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchFine(); }}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-left"
                />"""
content = content.replace(input_target, input_replace)

# 4. Strip the redundant checks that were moved outside
content = content.replace("""      const code = (searchCode || '').trim().toLowerCase();
      if (!code) {
        notify('يرجى إدخال كود المنشأة أو رقم الغرامة', 'warning');
        return;
      }""", """      const code = (searchCode || '').trim().toLowerCase();""")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Accountant UX patched.")
