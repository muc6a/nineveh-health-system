import re

path = "src/components/GlobalHeader.jsx"
with open(path, "r", encoding="utf-8") as f:
    gh = f.read()

# Add useState and useEffect if not present
if "useState" not in gh:
    gh = gh.replace("import React, { useContext } from 'react';", "import React, { useContext, useState, useEffect } from 'react';")
else:
    # If useState is already in the import but maybe not useEffect
    if "useEffect" not in gh:
        gh = gh.replace("import React, { useContext", "import React, { useContext, useEffect")

clock_logic = """
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dayName = new Intl.DateTimeFormat('ar-IQ', { weekday: 'long' }).format(now);
  const gregorian = new Intl.DateTimeFormat('ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const numericDate = new Intl.DateTimeFormat('en-GB').format(now);
  const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('ar-IQ', { hour: '2-digit', minute: '2-digit', hour12: true }).format(now).replace('AM', 'ص').replace('PM', 'م').replace('am', 'ص').replace('pm', 'م');
"""

# Insert clock_logic right after dynamicInfo extraction or before return
if "const [now, setNow] = useState" not in gh:
    gh = gh.replace("const displayTitle = dynamicInfo.title || overrideTitle;\n  const displaySubtitle = dynamicInfo.subtitle || overrideSubtitle;\n\n  return (",
                    f"const displayTitle = dynamicInfo.title || overrideTitle;\n  const displaySubtitle = dynamicInfo.subtitle || overrideSubtitle;\n{clock_logic}\n  return (")

old_date_ui = r"""<div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2\.5 py-1 rounded-xl">\s*<span>📅 \{new Date\(\)\.toLocaleDateString\('ar-IQ', \{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' \}\)\}</span>\s*<span className="text-slate-300">\|</span>\s*<span>⏰ \{new Date\(\)\.toLocaleTimeString\('ar-IQ', \{ hour: '2-digit', minute: '2-digit' \}\)\}</span>\s*</div>"""

new_date_ui = """<div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col text-right">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              📅 {dayName}، {gregorian} <span className="text-slate-400 font-normal">({numericDate})</span>
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
              🌙 {hijri}
            </span>
          </div>
          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1"></div>
          <div className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5" dir="ltr">
            {time} ⏰
          </div>
        </div>"""

if "📅 {dayName}" not in gh:
    gh = re.sub(old_date_ui, new_date_ui, gh, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(gh)

print("Date widget updated!")
