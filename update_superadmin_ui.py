import sys

with open('src/pages/SuperAdminPanel.jsx', 'r') as f:
    content = f.read()

# 1. State Variables
old_state = "const [headerInput, setHeaderInput] = useState(config.headerText);"
new_state = """const [headerInput, setHeaderInput] = useState(config.headerText);
  const [landingSettings, setLandingSettings] = useState({
    landingGreeting: config.landingGreeting || "مرحباً بكم في",
    landingTitle: config.landingTitle || "منظومة الرقابة الصحية",
    landingSubtitle: config.landingSubtitle || "نافذتكم الموثوقة لضمان بيئة صحية آمنة. اختر البوابة المناسبة لك للوصول إلى الخدمات الرقمية بكل سهولة وسرعة.",
    citizensPortalTitle: config.citizensPortalTitle || "بوابة المواطنين",
    citizensPortalDesc: config.citizensPortalDesc || "للبحث عن المنشآت، الاطلاع على تقييماتها الصحية، وتقديم الشكاوى والبلاغات إلكترونياً.",
    citizensPortalBtn: config.citizensPortalBtn || "الدخول للبحث والإبلاغ",
    ownersPortalTitle: config.ownersPortalTitle || "بوابة أصحاب المنشآت",
    ownersPortalDesc: config.ownersPortalDesc || "دخول مخصص لأصحاب المنشآت لمتابعة التقييمات خطط العمل والشهادات الصحية الخاصة بهم.",
    ownersPortalBtn: config.ownersPortalBtn || "الدخول كصاحب منشأة"
  });"""
content = content.replace(old_state, new_state)

# 2. saveZeroCodeConfig
old_save = """  const saveZeroCodeConfig = () => {
    setConfig({ ...config, headerText: headerInput });
    triggerAlert('تم حفظ إعدادات هوية المنظومة بنجاح!');
  };"""
new_save = """  const saveZeroCodeConfig = () => {
    setConfig({ ...config, headerText: headerInput, ...landingSettings });
    triggerAlert('تم حفظ إعدادات هوية المنظومة بنجاح!');
  };"""
content = content.replace(old_save, new_save)

# 3. Form Inputs
old_ui = """                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block">عنوان الترويسة الرئيسي للواجهات</label>
                    <input
                      type="text"
                      value={headerInput}
                      onChange={(e) => setHeaderInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-2">
                      هذا هو العنوان الرئيسي الذي سيظهر في أعلى الشاشة في كافة أرجاء المنظومة.
                    </p>
                  </div>"""
                  
new_ui = """                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 block">عنوان الترويسة الرئيسي للواجهات</label>
                    <input
                      type="text"
                      value={headerInput}
                      onChange={(e) => setHeaderInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-2 mb-4">
                      هذا هو العنوان الرئيسي الذي سيظهر في أعلى الشاشة في كافة أرجاء المنظومة.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-black text-slate-700 dark:text-white mb-4">نصوص واجهة الهبوط (الصفحة الرئيسية)</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">رسالة الترحيب</label>
                          <input type="text" value={landingSettings.landingGreeting} onChange={(e) => setLandingSettings({...landingSettings, landingGreeting: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 block">الاسم الرئيسي</label>
                          <input type="text" value={landingSettings.landingTitle} onChange={(e) => setLandingSettings({...landingSettings, landingTitle: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500" />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">الوصف التفصيلي</label>
                        <textarea value={landingSettings.landingSubtitle} onChange={(e) => setLandingSettings({...landingSettings, landingSubtitle: e.target.value})} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500 h-20 resize-none"></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-3 p-4 bg-teal-50 dark:bg-teal-900/10 rounded-2xl border border-teal-100 dark:border-teal-800/30">
                          <h4 className="text-xs font-black text-teal-600 dark:text-teal-400">بوابة المواطنين</h4>
                          <input type="text" placeholder="العنوان" value={landingSettings.citizensPortalTitle} onChange={(e) => setLandingSettings({...landingSettings, citizensPortalTitle: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-xs font-bold outline-none" />
                          <textarea placeholder="الوصف" value={landingSettings.citizensPortalDesc} onChange={(e) => setLandingSettings({...landingSettings, citizensPortalDesc: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-xs outline-none h-16 resize-none"></textarea>
                          <input type="text" placeholder="نص الزر" value={landingSettings.citizensPortalBtn} onChange={(e) => setLandingSettings({...landingSettings, citizensPortalBtn: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-800 text-xs outline-none" />
                        </div>

                        <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                          <h4 className="text-xs font-black text-amber-600 dark:text-amber-400">بوابة المنشآت</h4>
                          <input type="text" placeholder="العنوان" value={landingSettings.ownersPortalTitle} onChange={(e) => setLandingSettings({...landingSettings, ownersPortalTitle: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xs font-bold outline-none" />
                          <textarea placeholder="الوصف" value={landingSettings.ownersPortalDesc} onChange={(e) => setLandingSettings({...landingSettings, ownersPortalDesc: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xs outline-none h-16 resize-none"></textarea>
                          <input type="text" placeholder="نص الزر" value={landingSettings.ownersPortalBtn} onChange={(e) => setLandingSettings({...landingSettings, ownersPortalBtn: e.target.value})} className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xs outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>"""
content = content.replace(old_ui, new_ui)

with open('src/pages/SuperAdminPanel.jsx', 'w') as f:
    f.write(content)

print("Done updating SuperAdminPanel.jsx")
