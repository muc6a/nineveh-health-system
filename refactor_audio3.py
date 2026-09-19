import sys
import re

# 1. Refactor playBeep in AppContext.jsx
with open('src/context/AppContext.jsx', 'r', encoding='utf-8') as f:
    app_context = f.read()

old_playbeep = """  const playBeep = (type) => {
    try {
      if (soundPreferences && soundPreferences[type]) {
        const audio = new Audio(soundPreferences[type]);
        audio.play().catch(e => console.error("Error playing custom sound:", e));
        return;
      }
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Different tone based on type
      if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.08); // double beep
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.log('Audio disabled by browser policy');
    }
  };"""

new_playbeep = """  const playBeep = (typeOrObj) => {
    try {
      let soundObj = null;
      let eventType = null;
      
      if (typeof typeOrObj === 'string') {
        eventType = typeOrObj;
        soundObj = soundPreferences?.[eventType];
      } else if (typeof typeOrObj === 'object') {
        soundObj = typeOrObj;
      }
      
      // Handle legacy base64 strings directly
      if (typeof soundObj === 'string') {
        const audio = new Audio(soundObj);
        audio.play().catch(e => console.error("Error playing custom sound:", e));
        return;
      }

      // Extract type and customDataUrl if it's an object
      const actualType = soundObj?.type || eventType || 'beep_success';
      const customUrl = soundObj?.customDataUrl;

      if (actualType === 'custom' && customUrl) {
        const audio = new Audio(customUrl);
        audio.play().catch(e => console.error("Error playing custom sound:", e));
        return;
      }
      
      if (actualType === 'voice_male' || actualType === 'voice_female') {
          if ('speechSynthesis' in window) {
              const msg = new SpeechSynthesisUtterance("رسالة صوتية تجريبية للتأكد من عمل النظام بنجاح.");
              msg.lang = 'ar-SA';
              msg.rate = 0.9;
              
              let voices = window.speechSynthesis.getVoices();
              let isFemale = actualType === 'voice_female';
              
              let selectedVoice = voices.find(v => {
                  let name = v.name.toLowerCase();
                  if (isFemale) {
                      return name.includes('female') || name.includes('zira') || name.includes('amira') || name.includes('laila') || name.includes('salma') || name.includes('sana') || name.includes('zeina') || name.includes('mariam') || name.includes('tarik');
                  } else {
                      return (name.includes('male') && !name.includes('female')) || name.includes('shakir') || name.includes('maged') || name.includes('tarik') || name.includes('mehdi') || name.includes('hamid');
                  }
              });
              
              if (!selectedVoice) {
                  let arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
                  if (arabicVoices.length > 0) {
                      selectedVoice = isFemale ? arabicVoices[arabicVoices.length - 1] : arabicVoices[0];
                  }
              }
              
              if (selectedVoice) {
                  msg.voice = selectedVoice;
              } else {
                  msg.pitch = isFemale ? 1.5 : 0.8;
              }

              window.speechSynthesis.speak(msg);
          }
          return;
      }

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Tone generator library
      if (actualType === 'beep_error' || actualType === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else if (actualType === 'beep_alert' || actualType === 'notification') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.25);
      } else if (actualType === 'beep_bell') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 1.0);
      } else if (actualType === 'beep_chime') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.6);
      } else {
        // Default beep_success / success
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.08); // double beep
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.log('Audio disabled by browser policy');
    }
  };"""

if old_playbeep in app_context:
    app_context = app_context.replace(old_playbeep, new_playbeep)
    with open('src/context/AppContext.jsx', 'w', encoding='utf-8') as f:
        f.write(app_context)
    print("Updated AppContext.jsx playBeep")
else:
    print("Could not find playBeep in AppContext.jsx")

# 2. Refactor SuperAdminPanel.jsx
with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    superadmin = f.read()

# Add expandedEvent state
if "const [expandedEvent, setExpandedEvent] = useState(null);" not in superadmin:
    superadmin = superadmin.replace(
        "const [soundConfig, setSoundConfig] = useState(config.citizenSuccessSound || { type: 'voice_male', customDataUrl: null });",
        "const [soundConfig, setSoundConfig] = useState(config.citizenSuccessSound || { type: 'voice_male', customDataUrl: null });\n  const [expandedEvent, setExpandedEvent] = useState(null);"
    )
    # Also add temporary soundPreferences state so it updates in UI before saving
    superadmin = superadmin.replace(
        "const [expandedEvent, setExpandedEvent] = useState(null);",
        "const [expandedEvent, setExpandedEvent] = useState(null);\n  const [tempSoundPrefs, setTempSoundPrefs] = useState({...soundPreferences});"
    )

old_notifications_block = """        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Bell className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">مركز الإشعارات</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">تخصيص النغمات وأصوات النظام المسموعة عند وقوع الأحداث.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'notification', label: 'إشعار جديد (رسالة، تنبيه عام)', defaultIcon: <Bell className="w-5 h-5"/> },
                  { id: 'success', label: 'إجراء ناجح (حفظ، إرسال، إنجاز)', defaultIcon: <CheckCircle className="w-5 h-5"/> },
                  { id: 'error', label: 'خطأ أو تنبيه هام (تلوث، رفض)', defaultIcon: <ShieldAlert className="w-5 h-5"/> },
                  { id: 'login', label: 'تسجيل الدخول للنظام', defaultIcon: <Power className="w-5 h-5"/> },
                ].map(event => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm">
                        {event.defaultIcon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm">{event.label}</h4>
                        <p className="text-xs text-slate-500">{soundPreferences?.[event.id] ? 'نغمة مخصصة' : 'النغمة الافتراضية للنظام'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => playBeep(event.id)}
                        className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors cursor-pointer"
                        title="تجربة الصوت"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      
                      <label className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4" /> رفع ملف
                        <input 
                          type="file" 
                          accept="audio/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 1024 * 1024) {
                                notify('حجم الملف كبير جداً، يرجى اختيار ملف أقل من 1 ميغابايت', 'error');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (loadEvent) => {
                                setSoundPreferences(prev => ({ ...prev, [event.id]: loadEvent.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                        />
                      </label>

                      {soundPreferences?.[event.id] && (
                        <button 
                          onClick={() => {
                            const newPrefs = { ...soundPreferences };
                            delete newPrefs[event.id];
                            setSoundPreferences(newPrefs);
                          }}
                          className="p-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors cursor-pointer"
                          title="استعادة الافتراضي"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* إعدادات الأصوات وبوابة الرقيب المدني */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 shadow-sm mt-6">
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <Bell className="w-5 h-5 text-teal-600" />
                <span>إعدادات الأصوات ورسائل الشكر (بوابة الرقيب المدني)</span>
              </h2>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-500">اختر نوع الصوت الذي يظهر للمواطن عند تقديم البلاغ بنجاح:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'beep_success', label: 'نغمة إشعار (نجاح لطيف)' }, 
                    { id: 'beep_alert', label: 'نغمة إشعار (رسمية)' }, 
                    { id: 'beep_error', label: 'نغمة إشعار (قوية)' }, 
                    { id: 'voice_male', label: 'صوت ذكاء اصطناعي (رجل)' }, 
                    { id: 'voice_female', label: 'صوت ذكاء اصطناعي (فتاة)' }, 
                    { id: 'custom', label: 'رفع صوت مخصص (بصمة)' }
                  ].map(opt => (
                    <div key={opt.id} className={`p-4 border rounded-xl cursor-pointer transition-all ${soundConfig.type === opt.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'}`} onClick={() => setSoundConfig({...soundConfig, type: opt.id})}>
                       <div className="flex items-center gap-3">
                         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${soundConfig.type === opt.id ? 'border-teal-600' : 'border-slate-300'}`}>
                           {soundConfig.type === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                         </div>
                         <span className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate">{opt.label}</span>
                       </div>
                    </div>
                  ))}
                </div>

                {soundConfig.type === 'custom' && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">ارفع بصمتك الصوتية (MP3/WAV)</label>
                    <input type="file" accept="audio/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setSoundConfig({...soundConfig, customDataUrl: ev.target.result});
                          triggerAlert('تم قراءة الملف الصوتي بنجاح. لا تنس حفظ التغييرات.');
                        };
                        reader.readAsDataURL(file);
                      }
                    }} className="w-full text-sm" />
                    {soundConfig.customDataUrl && <p className="text-xs text-teal-600 mt-2 font-bold">✓ يوجد ملف صوتي مخصص محفوظ حالياً.</p>}
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <button onClick={() => {
                    if (soundConfig.type === 'custom' && soundConfig.customDataUrl) {
                      const audio = new Audio(soundConfig.customDataUrl);
                      audio.play();
                    } else if (soundConfig.type === 'voice_male' || soundConfig.type === 'voice_female') {
                      if ('speechSynthesis' in window) {
                        const msg = new SpeechSynthesisUtterance("عاشت ايدك. شكراً لمساهمتك في حماية المجتمع.");
                        msg.lang = 'ar-SA';
                        msg.rate = 0.9;
                        
                        let voices = window.speechSynthesis.getVoices();
                        let isFemale = soundConfig.type === 'voice_female';
                        
                        // Try to find a matching voice
                        let selectedVoice = voices.find(v => {
                            let name = v.name.toLowerCase();
                            if (isFemale) {
                                return name.includes('female') || name.includes('zira') || name.includes('amira') || name.includes('laila') || name.includes('salma') || name.includes('sana') || name.includes('zeina') || name.includes('mariam') || name.includes('tarik'); // some systems mistakenly tag female voices
                            } else {
                                return (name.includes('male') && !name.includes('female')) || name.includes('shakir') || name.includes('maged') || name.includes('tarik') || name.includes('mehdi') || name.includes('hamid');
                            }
                        });
                        
                        // Fallback logic for Arabic specific
                        if (!selectedVoice) {
                            let arabicVoices = voices.filter(v => v.lang.startsWith('ar'));
                            if (arabicVoices.length > 0) {
                                // Just try to guess based on array index if we can't find by name
                                selectedVoice = isFemale ? arabicVoices[arabicVoices.length - 1] : arabicVoices[0];
                            }
                        }
                        
                        if (selectedVoice) {
                            msg.voice = selectedVoice;
                        } else {
                            msg.pitch = isFemale ? 1.5 : 0.8;
                        }

                        window.speechSynthesis.speak(msg);
                      }
                    } else if (soundConfig.type === 'beep_alert') {
                      playBeep('alert');
                    } else if (soundConfig.type === 'beep_error') {
                      playBeep('error');
                    } else {
                      playBeep('success');
                    }
                  }} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-300 transition">
                    <Play className="w-4 h-4" /> اختبار الصوت
                  </button>
                  <button onClick={() => {
                    const defaultSound = { type: 'voice_male', customDataUrl: null };
                    setSoundConfig(defaultSound);
                    setConfig(prev => ({...prev, citizenSuccessSound: defaultSound}));
                    triggerAlert('تم استعادة الإعدادات الافتراضية بنجاح.');
                  }} className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl font-bold flex items-center gap-2 transition">
                    <RefreshCcw className="w-4 h-4" />
                    استعادة الافتراضي
                  </button>
                  <button onClick={saveZeroCodeConfig} className="px-6 py-2 bg-teal-600 text-white rounded-xl font-black shadow-lg hover:shadow-teal-500/30 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        )}"""

new_notifications_block = """        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center shadow-inner">
                  <Bell className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">مركز الإشعارات</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">تخصيص كافة النغمات والأصوات المسموعة عند وقوع الأحداث في المنظومة وبوابة الرقيب المدني.</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'notification', label: 'إشعار جديد (رسالة، تنبيه عام)', defaultIcon: <Bell className="w-5 h-5"/>, fallbackStr: 'notification' },
                  { id: 'success', label: 'إجراء ناجح (حفظ، إرسال، إنجاز)', defaultIcon: <CheckCircle className="w-5 h-5"/>, fallbackStr: 'success' },
                  { id: 'error', label: 'خطأ أو تنبيه هام (تلوث، رفض)', defaultIcon: <ShieldAlert className="w-5 h-5"/>, fallbackStr: 'error' },
                  { id: 'login', label: 'تسجيل الدخول للنظام', defaultIcon: <Power className="w-5 h-5"/>, fallbackStr: 'login' },
                  { id: 'citizen_success', label: 'بوابة الرقيب المدني (شكر المواطن بعد البلاغ)', defaultIcon: <Users className="w-5 h-5"/>, fallbackStr: 'citizen_success' },
                ].map(event => {
                  const isCitizen = event.id === 'citizen_success';
                  const currentPrefs = isCitizen ? soundConfig : (tempSoundPrefs[event.id] || { type: event.fallbackStr, customDataUrl: null });
                  
                  // Handle legacy strings in tempSoundPrefs
                  const resolvedPrefs = typeof currentPrefs === 'string' ? { type: 'custom', customDataUrl: currentPrefs } : currentPrefs;
                  
                  const isExpanded = expandedEvent === event.id;

                  return (
                    <div key={event.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300">
                      
                      {/* Accordion Header */}
                      <div 
                        onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${isExpanded ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                            {event.defaultIcon}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-sm">{event.label}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {resolvedPrefs.type === 'custom' ? 'نغمة مخصصة' : 'نغمة من مكتبة النظام'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                playBeep(resolvedPrefs);
                              }}
                              className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors"
                              title="تجربة الصوت الحالي"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                               <ChevronDown className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/20 animate-in slide-in-from-top-2 duration-300">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">اختر النغمة المفضلة لهذا الإجراء:</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                              { id: 'beep_success', label: 'نغمة إشعار (نجاح لطيف)' }, 
                              { id: 'beep_alert', label: 'نغمة إشعار (رسمية)' }, 
                              { id: 'beep_error', label: 'نغمة إشعار (قوية)' }, 
                              { id: 'beep_chime', label: 'نغمة إشعار (رنين)' }, 
                              { id: 'beep_bell', label: 'نغمة إشعار (جرس)' }, 
                              { id: 'voice_male', label: 'ذكاء اصطناعي (رجل)' }, 
                              { id: 'voice_female', label: 'ذكاء اصطناعي (فتاة)' }, 
                              { id: 'custom', label: 'رفع صوت مخصص' }
                            ].map(opt => (
                              <div key={opt.id} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${resolvedPrefs.type === opt.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30'}`} onClick={() => {
                                 const updated = { ...resolvedPrefs, type: opt.id };
                                 if (isCitizen) {
                                     setSoundConfig(updated);
                                 } else {
                                     setTempSoundPrefs(prev => ({ ...prev, [event.id]: updated }));
                                 }
                              }}>
                                 <div className="flex items-center gap-2">
                                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${resolvedPrefs.type === opt.id ? 'border-indigo-600' : 'border-slate-300'}`}>
                                     {resolvedPrefs.type === opt.id && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                   </div>
                                   <span className="font-bold text-slate-700 dark:text-slate-300 text-xs truncate">{opt.label}</span>
                                 </div>
                                 <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       // Play the preview of the option just clicked
                                       playBeep({ type: opt.id, customDataUrl: resolvedPrefs.customDataUrl });
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                 >
                                    <Play className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                            ))}
                          </div>

                          {resolvedPrefs.type === 'custom' && (
                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">ارفع ملفك الصوتي (MP3/WAV)</label>
                              <div className="flex items-center gap-3">
                                <label className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2">
                                  <Upload className="w-4 h-4" /> تصفح الملفات
                                  <input 
                                    type="file" 
                                    accept="audio/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        if (file.size > 1.5 * 1024 * 1024) {
                                          triggerAlert('حجم الملف كبير جداً، يرجى اختيار ملف أقل من 1.5 ميغابايت');
                                          return;
                                        }
                                        const reader = new FileReader();
                                        reader.onload = (loadEvent) => {
                                          const b64 = loadEvent.target.result;
                                          const updated = { type: 'custom', customDataUrl: b64 };
                                          if (isCitizen) {
                                              setSoundConfig(updated);
                                          } else {
                                              setTempSoundPrefs(prev => ({ ...prev, [event.id]: updated }));
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }} 
                                  />
                                </label>
                                {resolvedPrefs.customDataUrl && <p className="text-xs text-teal-600 font-bold">✓ تم رفع ملف مخصص بنجاح</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Centralized Controls for Notifications Center */}
              <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap justify-end gap-3">
                 <button onClick={() => {
                    const confirmReset = window.confirm('هل أنت متأكد من استعادة كافة الأصوات لوضعها الافتراضي وإزالة الملفات المرفوعة؟');
                    if (confirmReset) {
                       setTempSoundPrefs({});
                       const defaultSound = { type: 'voice_male', customDataUrl: null };
                       setSoundConfig(defaultSound);
                       triggerAlert('تم استعادة الإعدادات الافتراضية. لا تنس الضغط على حفظ التغييرات لاعتمادها.');
                    }
                  }} className="px-5 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl font-bold flex items-center gap-2 transition">
                    <RefreshCcw className="w-4 h-4" />
                    استعادة الافتراضي
                  </button>
                  <button onClick={() => {
                    // Save both generic system sounds and citizen sounds
                    setSoundPreferences(tempSoundPrefs);
                    setConfig(prev => ({...prev, citizenSuccessSound: soundConfig}));
                    saveZeroCodeConfig(); // Trigger actual API/localStorage save
                    triggerAlert('تم حفظ واعتماد كافة إعدادات الأصوات بنجاح.');
                  }} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </button>
              </div>

            </div>
          </div>
        )}"""

if old_notifications_block in superadmin:
    superadmin = superadmin.replace(old_notifications_block, new_notifications_block)
    # Ensure ChevronDown is imported
    if "ChevronDown" not in superadmin:
        superadmin = superadmin.replace("import {", "import { ChevronDown,")
        # Just to be safe if ChevronDown is not exported from wherever, I will use lucide-react directly
        if "from 'lucide-react';" in superadmin:
            superadmin = superadmin.replace("from 'lucide-react';", ", ChevronDown } from 'lucide-react';").replace("ChevronDown,", "").replace(", ChevronDown } from", ", ChevronDown } from")
            
    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(superadmin)
    print("Updated SuperAdminPanel.jsx successfully")
else:
    print("Could not find old_notifications_block in SuperAdminPanel.jsx")
