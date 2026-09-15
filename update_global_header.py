import re

path = "src/components/GlobalHeader.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove emojis from the greeting
content = content.replace("let timeEmoji = '👋';", "")
content = content.replace("timeEmoji = '🌅';", "")
content = content.replace("timeEmoji = '🌇';", "")
content = content.replace("timeEmoji = '🌙';", "")
content = content.replace("title: `${timeGreeting} ${roleTitle} ${timeEmoji}`", "title: `${timeGreeting} ${roleTitle}`")

# Replace the return block entirely
new_return = """  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 relative z-40">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-black text-slate-800 dark:text-white">
            {displayTitle}
          </h2>
          <p className="text-[11px] font-bold text-slate-400 mt-0.5">
            {displaySubtitle}
          </p>
        </div>
      </div>
      
      {/* Action Buttons & Unified Info Rectangle ordered Left to Right in code, which renders Left to Right in LTR, or Right to Left in RTL. Wait, the user wants from Left to Right: Unified Rectangle, Settings, Bell.
      Since the layout is RTL (dir="rtl"), flex items normally flow Right-to-Left. 
      To make them appear Left-to-Right in an RTL layout, we can use `flex-row-reverse`.
      Wait, in RTL:
      [Bell] [Settings] [Rectangle]
      If they want it ordered Left-to-Right: Rectangle -> Settings -> Bell. 
      So Rectangle is on the left, Settings middle, Bell on the right.
      In RTL `flex` (which goes right-to-left), to get Rectangle on left, it must be the LAST item in the DOM, or we use flex-row-reverse.
      Let's just use regular flex with the order: Bell (right), Settings (middle), Rectangle (left).
      */}
      <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
        
        <NotificationBell />
        
        {children}
        
        {(showPrintButton && hasPerm('exportData')) && (
          <button 
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 no-print"
          >
            🖨️ طباعة الموقف الإحصائي
          </button>
        )}

        {/* Unified Weather & Date/Time Rectangle */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <WeatherWidget variant="full" />
          </div>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-100">
              {dayName}، {gregorian}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {hijri}
            </span>
          </div>
          <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
          <div className="text-sm font-black text-slate-700 dark:text-slate-200" dir="ltr">
            {time}
          </div>
        </div>
        
      </div>
    </div>
  );
};
"""

# Replace the return block in content
return_idx = content.find("  return (")
if return_idx != -1:
    content = content[:return_idx] + new_return

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated GlobalHeader")
