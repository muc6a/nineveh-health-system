import sys

with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && ("""

replacement = """              </div>
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
        )}

        {activeTab === 'settings' && ("""

if target in content:
    content = content.replace(target, replacement)
    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected Audio Settings in Notifications tab")
else:
    print("Target block not found")
