import sys
import re

# 1. Update AppContext.jsx playBeep
with open('src/context/AppContext.jsx', 'r', encoding='utf-8') as f:
    app_context = f.read()

old_playbeep_voice_block = """      if (actualType === 'voice_male' || actualType === 'voice_female') {
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
      }"""

new_playbeep_voice_block = """      if (actualType === 'voice_male' || actualType === 'voice_female' || actualType === 'voice_old') {
          if ('speechSynthesis' in window) {
              const msgText = soundObj?.messageText || "عاشت إيدك، شكراً لمساعدتك إيانا في حماية مجتمعنا.";
              const msg = new SpeechSynthesisUtterance(msgText);
              msg.lang = 'ar-SA';
              msg.rate = actualType === 'voice_old' ? 0.7 : 0.9;
              
              let voices = window.speechSynthesis.getVoices();
              let isFemale = actualType === 'voice_female';
              
              let selectedVoice = voices.find(v => {
                  let name = v.name.toLowerCase();
                  if (isFemale) {
                      return name.includes('female') || name.includes('zira') || name.includes('amira') || name.includes('laila') || name.includes('salma') || name.includes('sana') || name.includes('zeina') || name.includes('mariam');
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
              }
              
              if (actualType === 'voice_old') {
                  msg.pitch = 0.5;
                  msg.rate = 0.75;
              } else if (isFemale) {
                  msg.pitch = 1.5;
              } else {
                  msg.pitch = 0.9;
              }

              window.speechSynthesis.speak(msg);
          }
          return;
      }"""

if old_playbeep_voice_block in app_context:
    app_context = app_context.replace(old_playbeep_voice_block, new_playbeep_voice_block)
    with open('src/context/AppContext.jsx', 'w', encoding='utf-8') as f:
        f.write(app_context)
    print("Updated AppContext.jsx")
else:
    print("Error: Could not find old voice block in AppContext")

# 2. Update PublicQRScore.jsx TTS logic
with open('src/pages/PublicQRScore.jsx', 'r', encoding='utf-8') as f:
    public_qr = f.read()

old_qr_voice = """    } else if (soundConf.type === 'voice_male' || soundConf.type === 'voice_female') {
      try {
        if ('speechSynthesis' in window) {
          const msg = new SpeechSynthesisUtterance("عاشت ايدك. شكراً لمساهمتك في حماية المجتمع.");
          msg.lang = 'ar-SA';
          msg.rate = 0.9;
          
          let voices = window.speechSynthesis.getVoices();
          let isFemale = soundConf.type === 'voice_female';
          
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
      } catch (err) {
        console.log('Speech synthesis failed', err);
        if (playBeep) playBeep('success');
      }
    }"""

new_qr_voice = """    } else if (soundConf.type === 'voice_male' || soundConf.type === 'voice_female' || soundConf.type === 'voice_old') {
      try {
        if ('speechSynthesis' in window) {
          const msgText = soundConf.messageText || "عاشت إيدك، شكراً لمساعدتك إيانا في حماية مجتمعنا.";
          const msg = new SpeechSynthesisUtterance(msgText);
          msg.lang = 'ar-SA';
          
          let voices = window.speechSynthesis.getVoices();
          let isFemale = soundConf.type === 'voice_female';
          
          let selectedVoice = voices.find(v => {
              let name = v.name.toLowerCase();
              if (isFemale) {
                  return name.includes('female') || name.includes('zira') || name.includes('amira') || name.includes('laila') || name.includes('salma') || name.includes('sana') || name.includes('zeina') || name.includes('mariam');
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
          }
          
          if (soundConf.type === 'voice_old') {
              msg.pitch = 0.5;
              msg.rate = 0.75;
          } else if (isFemale) {
              msg.pitch = 1.5;
              msg.rate = 0.9;
          } else {
              msg.pitch = 0.9;
              msg.rate = 0.9;
          }

          window.speechSynthesis.speak(msg);
        }
      } catch (err) {
        console.log('Speech synthesis failed', err);
        if (playBeep) playBeep('success');
      }
    }"""

if old_qr_voice in public_qr:
    public_qr = public_qr.replace(old_qr_voice, new_qr_voice)
    with open('src/pages/PublicQRScore.jsx', 'w', encoding='utf-8') as f:
        f.write(public_qr)
    print("Updated PublicQRScore.jsx")
else:
    print("Error: Could not find old QR voice block in PublicQRScore.jsx")

# 3. Update SuperAdminPanel.jsx UI
with open('src/pages/SuperAdminPanel.jsx', 'r', encoding='utf-8') as f:
    superadmin = f.read()

# Replace the inner map array for the grid items so they depend on isCitizen
old_map_array = """{[
                              { id: 'beep_success', label: 'نغمة إشعار (نجاح لطيف)' }, 
                              { id: 'beep_alert', label: 'نغمة إشعار (رسمية)' }, 
                              { id: 'beep_error', label: 'نغمة إشعار (قوية)' }, 
                              { id: 'beep_chime', label: 'نغمة إشعار (رنين)' }, 
                              { id: 'beep_bell', label: 'نغمة إشعار (جرس)' }, 
                              { id: 'voice_male', label: 'ذكاء اصطناعي (رجل)' }, 
                              { id: 'voice_female', label: 'ذكاء اصطناعي (فتاة)' }, 
                              { id: 'custom', label: 'رفع صوت مخصص' }
                            ]"""

new_map_array = """(isCitizen ? [
                              { id: 'voice_male', label: 'صوت آلي (رجل)' }, 
                              { id: 'voice_female', label: 'صوت آلي (فتاة)' }, 
                              { id: 'voice_old', label: 'صوت آلي (رجل كبير وقور)' }, 
                              { id: 'custom', label: 'رفع ملف مخصص' }
                            ] : [
                              { id: 'beep_success', label: 'نغمة إشعار (نجاح لطيف)' }, 
                              { id: 'beep_alert', label: 'نغمة إشعار (رسمية)' }, 
                              { id: 'beep_error', label: 'نغمة إشعار (قوية)' }, 
                              { id: 'beep_chime', label: 'نغمة إشعار (رنين)' }, 
                              { id: 'beep_bell', label: 'نغمة إشعار (جرس)' }, 
                              { id: 'custom', label: 'رفع صوت مخصص' }
                            ])"""

if old_map_array in superadmin:
    superadmin = superadmin.replace(old_map_array, new_map_array)
    
    # Add text selection block for isCitizen
    old_custom_block = """{resolvedPrefs.type === 'custom' && ("""
    
    citizen_text_block = """
                          {isCitizen && ['voice_male', 'voice_female', 'voice_old'].includes(resolvedPrefs.type) && (
                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700">
                              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">اختر النص الترحيبي المراد نطقه (بوابة الرقيب المدني):</label>
                              <div className="space-y-2">
                                {[
                                  "عاشت إيدك، شكراً لمساعدتك إيانا في حماية مجتمعنا.",
                                  "شكراً لك، بجهودك ودعمك نحمي مجتمعنا ونحافظ على صحتنا.",
                                  "شكراً لك لمساعدتنا في حماية المجتمع، تم استلام بلاغك بنجاح."
                                ].map((txt, idx) => (
                                  <label key={idx} className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${resolvedPrefs.messageText === txt || (!resolvedPrefs.messageText && idx === 0) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'}">
                                    <input 
                                      type="radio" 
                                      name="citizen_text" 
                                      checked={resolvedPrefs.messageText === txt || (!resolvedPrefs.messageText && idx === 0)}
                                      onChange={() => {
                                          setSoundConfig({...resolvedPrefs, messageText: txt});
                                      }}
                                      className="mt-1"
                                    />
                                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{txt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {resolvedPrefs.type === 'custom' && ("""
                          
    superadmin = superadmin.replace(old_custom_block, citizen_text_block)

    # Need to fix the template string in the map I just inserted
    superadmin = superadmin.replace("`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${resolvedPrefs.messageText === txt || (!resolvedPrefs.messageText && idx === 0) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'}`", "className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${resolvedPrefs.messageText === txt || (!resolvedPrefs.messageText && idx === 0) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'}`")
    superadmin = superadmin.replace("className=\"flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${resolvedPrefs.messageText === txt || (!resolvedPrefs.messageText && idx === 0) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'}\"", "className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${resolvedPrefs.messageText === txt || (!resolvedPrefs.messageText && idx === 0) ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-slate-200 dark:border-slate-700'}`}")


    with open('src/pages/SuperAdminPanel.jsx', 'w', encoding='utf-8') as f:
        f.write(superadmin)
    print("Updated SuperAdminPanel.jsx")
else:
    print("Error: Could not find old_map_array in SuperAdminPanel.jsx")
