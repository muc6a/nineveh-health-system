import re
import sys

with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add State
content = content.replace(
    "const [scaleSelector, setScaleSelector] = useState(config.uiScale);",
    "const [scaleSelector, setScaleSelector] = useState(config.uiScale);\n  const [soundConfig, setSoundConfig] = useState(config.citizenSuccessSound || { type: 'voice_male', customDataUrl: null });"
)

# 2. Add to config
content = content.replace(
    "uiScale: scaleSelector,\n      ...landingSettings",
    "uiScale: scaleSelector,\n      citizenSuccessSound: soundConfig,\n      ...landingSettings"
)

# 3. Add Tab
tab_target = """              <button
                onClick={() => setSubSettingsTab('public_cms')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subSettingsTab === 'public_cms' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                📢 إدارة البوابات
              </button>
            </div>"""

tab_replace = """              <button
                onClick={() => setSubSettingsTab('public_cms')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subSettingsTab === 'public_cms' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                📢 إدارة البوابات
              </button>
              <button
                onClick={() => setSubSettingsTab('notifications_sounds')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${subSettingsTab === 'notifications_sounds' ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
              >
                🔔 الإشعارات والأصوات
              </button>
            </div>"""

content = content.replace(tab_target, tab_replace)

# 4. Add UI block
content = content.replace(
    """                </div>
              )}
              

</div>
          </section>
        )}""",
    """                </div>
              )}
              
              {subSettingsTab === 'notifications_sounds' && (
                <div className="glassmorphic-card p-6 space-y-6">
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Bell className="w-5 h-5 text-teal-600" />
                    <span>إعدادات الأصوات ورسائل الشكر (بوابة الرقيب المدني)</span>
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">اختر نوع الصوت الذي يظهر للمواطن عند تقديم البلاغ بنجاح:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[{ id: 'beep_success', label: 'نغمة النجاح القياسية' }, { id: 'voice_male', label: 'صوت ذكاء اصطناعي (رجل)' }, { id: 'voice_female', label: 'صوت ذكاء اصطناعي (فتاة)' }, { id: 'custom', label: 'رفع صوت مخصص (بصمة)' }].map(opt => (
                        <div key={opt.id} className={`p-4 border rounded-xl cursor-pointer transition-all ${soundConfig.type === opt.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-slate-700'}`} onClick={() => setSoundConfig({...soundConfig, type: opt.id})}>
                           <div className="flex items-center gap-3">
                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${soundConfig.type === opt.id ? 'border-teal-600' : 'border-slate-300'}`}>
                               {soundConfig.type === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                             </div>
                             <span className="font-bold text-slate-700 dark:text-slate-300">{opt.label}</span>
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

                    <div className="flex justify-end gap-3 pt-4">
                      <button onClick={() => {
                        if (soundConfig.type === 'custom' && soundConfig.customDataUrl) {
                          const audio = new Audio(soundConfig.customDataUrl);
                          audio.play();
                        } else if (soundConfig.type === 'voice_male' || soundConfig.type === 'voice_female') {
                          if ('speechSynthesis' in window) {
                            const msg = new SpeechSynthesisUtterance("عاشت ايدك. شكراً لمساهمتك في حماية المجتمع.");
                            msg.lang = 'ar-SA';
                            msg.rate = 0.9;
                            msg.pitch = soundConfig.type === 'voice_female' ? 1.5 : 1.0;
                            window.speechSynthesis.speak(msg);
                          }
                        } else {
                          playBeep('success');
                        }
                      }} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-300 transition">
                        <Play className="w-4 h-4" /> اختبار الصوت
                      </button>
                      <button onClick={saveZeroCodeConfig} className="px-6 py-2 bg-teal-600 text-white rounded-xl font-black shadow-lg hover:shadow-teal-500/30 transition-all flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        حفظ الإعدادات
                      </button>
                    </div>
                  </div>
                </div>
              )}
              

</div>
          </section>
        )}"""
)

with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated SuperAdminPanel.jsx successfully")
