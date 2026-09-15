import re

path = "src/components/DisplayPreferencesModal.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure Music/Volume icons are imported
if "Music" not in content:
    content = content.replace("import { Eye, X, ChevronUp, ChevronDown, ListOrdered } from 'lucide-react';", "import { Eye, X, ChevronUp, ChevronDown, ListOrdered, Music, Upload, Play } from 'lucide-react';")

# Extract the sound context vars
if "soundPreferences" not in content:
    content = content.replace("const { uiPreferences, setUiPreferences, notify, user, activeSidebarTabs } = useContext(AppContext);", "const { uiPreferences, setUiPreferences, notify, user, activeSidebarTabs, soundPreferences, setSoundPreferences, playBeep } = useContext(AppContext);")
    content = content.replace("const [draftUiPreferences, setDraftUiPreferences] = useState(uiPreferences);", "const [draftUiPreferences, setDraftUiPreferences] = useState(uiPreferences);\n  const [draftSoundPreferences, setDraftSoundPreferences] = useState(soundPreferences || {});\n")

# Preset sounds definition
preset_sounds = """
  const PRESET_SOUNDS = [
    { id: 'default', name: 'الافتراضي (System Beep)', url: '' },
    { id: 'chime', name: 'نغمة رنين (Chime)', url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
    { id: 'bell', name: 'جرس خفيف (Soft Bell)', url: 'https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg' },
    { id: 'alert', name: 'تنبيه سريع (Quick Alert)', url: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' },
    { id: 'echo', name: 'صدى (Echo)', url: 'https://actions.google.com/sounds/v1/water/water_drop.ogg' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        if (notify) notify('حجم الملف كبير جداً، الحد الأقصى هو 2 ميغابايت', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setDraftSoundPreferences({ ...draftSoundPreferences, success: event.target.result, error: event.target.result });
        if (notify) notify('تم رفع النغمة المخصصة بنجاح، يمكنك تجربتها الآن', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const playPreview = (url) => {
    if (!url) {
      playBeep('success');
      return;
    }
    const audio = new Audio(url);
    audio.play().catch(err => console.error(err));
  };
"""

# Insert presets
if "const PRESET_SOUNDS" not in content:
    content = content.replace("const hasPerm = (p) => user?.permissions?.[p] === true;", "const hasPerm = (p) => user?.permissions?.[p] === true;\n" + preset_sounds)

# We need to add the sound UI right after Tab Reordering Control
# Let's locate the end of Typography Controls
search_str = """{/* Tab Reordering Control */}"""
sound_ui = """{/* Sound Preferences */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-teal-500" />
                  مركز نغمات الإشعارات (Notification Sounds)
                </label>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    {PRESET_SOUNDS.map(sound => (
                      <label key={sound.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${draftSoundPreferences?.success === sound.url ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="sound_preset" 
                            className="hidden"
                            checked={draftSoundPreferences?.success === sound.url}
                            onChange={() => setDraftSoundPreferences({ ...draftSoundPreferences, success: sound.url, error: sound.url })}
                          />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{sound.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); playPreview(sound.url); }}
                          className="p-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-teal-600 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all">
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">رفع نغمة مخصصة (MP3/WAV)</span>
                      <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                    {draftSoundPreferences?.success && draftSoundPreferences.success.startsWith('data:audio') && (
                      <div className="mt-2 text-center text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                        تم تحميل نغمة مخصصة
                        <button onClick={() => playPreview(draftSoundPreferences.success)} className="ml-2 underline">تجربة</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              """

content = content.replace(search_str, sound_ui + search_str)

# Update the save button
content = content.replace("setUiPreferences(draftUiPreferences);", "setUiPreferences(draftUiPreferences);\n              if (setSoundPreferences) setSoundPreferences(draftSoundPreferences);")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated DisplayPreferencesModal.jsx")
