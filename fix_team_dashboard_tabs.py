import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add states for the sub-tabs
if "const [directiveTab, setDirectiveTab] = useState('inbox');" not in content:
    content = content.replace("const [isSidebarOpen, setIsSidebarOpen] = useState(false);", "const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n  const [directiveTab, setDirectiveTab] = useState('inbox');\n  const [complaintTab, setComplaintTab] = useState('citizens');")

# Directives Tab Replacement
directives_old = re.search(r"\{activeTab === 'directives' && hasPerm\('showDirectivesPage'\) && \(\n.*?\}\)\n", content, flags=re.DOTALL)
if directives_old:
    new_directives = """{activeTab === 'directives' && (hasPerm('showDirectivesPage') || hasPerm('sendDirectives') || hasPerm('replyToDirectives')) && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">التبليغات الإدارية</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">إدارة التوجيهات الرسمية والتواصل مع الإدارة</p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {hasPerm('showDirectivesPage') && (
                <button 
                  onClick={() => setDirectiveTab('inbox')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${directiveTab === 'inbox' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <Mail className="w-4 h-4" />
                  صندوق الوارد ({myDirectives.length})
                </button>
              )}
              {hasPerm('sendDirectives') && (
                <button 
                  onClick={() => setDirectiveTab('send')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${directiveTab === 'send' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <Send className="w-4 h-4" />
                  إرسال تبليغ
                </button>
              )}
              {hasPerm('replyToDirectives') && (
                <button 
                  onClick={() => setDirectiveTab('replies')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${directiveTab === 'replies' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <MessageCircle className="w-4 h-4" />
                  سجل الردود
                </button>
              )}
            </div>

            <div className="glassmorphic-card p-5 space-y-4">
              {directiveTab === 'inbox' && hasPerm('showDirectivesPage') && (
                <>
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                    <h3 className="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                      <span>📢 التبليغات الواردة</span>
                    </h3>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {myDirectives.map((dir) => (
                      <div key={dir.id} className={`p-4 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.01] ${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-900/40 border-2 border-teal-500 shadow-lg shadow-teal-500/20' : 'border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/20'}`}>
                        <div className={`absolute top-0 right-0 h-full ${dir.text.startsWith('رد على تبليغ:') ? 'w-2 bg-teal-500' : 'w-1 bg-amber-500'}`}></div>
                        <div className="flex justify-between items-center mb-1 relative z-10">
                          <span className={`text-[10px] text-white px-2 py-0.5 rounded-lg font-black ${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-600' : 'bg-amber-500'}`}>
                            {dir.text.startsWith('رد على تبليغ:') ? 'رد جديد 💬' : 'توجيه عاجل'}
                          </span>
                          <span className={`text-[9px] font-bold ${dir.text.startsWith('رد على تبليغ:') ? 'text-teal-400' : 'text-amber-600 dark:text-amber-400'}`}>{dir.date}</span>
                        </div>
                        <p className={`text-xs font-black leading-relaxed mt-1.5 relative z-10 ${dir.text.startsWith('رد على تبليغ:') ? 'text-teal-100' : 'text-amber-900 dark:text-amber-200'}`}>{dir.text}</p>
                        <span className="text-[9px] text-slate-400 block mt-2">الجهة المرسلة: {dir.sender}</span>
                      </div>
                    ))}
                    {myDirectives.length === 0 && (
                      <div className="text-center p-8 text-slate-400 font-bold text-xs bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl">
                        لا توجد توجيهات رسمية نشطة حالياً.
                      </div>
                    )}
                  </div>
                </>
              )}
              {directiveTab === 'send' && hasPerm('sendDirectives') && (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-black text-slate-700 dark:text-slate-300 mb-2">إرسال تبليغ للإدارة المركزية</h4>
                  <p className="text-xs text-slate-500 mb-4">اكتب التبليغ أو الاستفسار الموجه لغرفة العمليات المركزية.</p>
                  <textarea className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm font-bold resize-none h-32 outline-none focus:border-amber-500 mb-4" placeholder="اكتب نص التبليغ هنا..."></textarea>
                  <button className="px-6 py-3 rounded-xl bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/20 hover:bg-amber-700 transition-colors w-full sm:w-auto">إرسال التبليغ</button>
                </div>
              )}
              {directiveTab === 'replies' && hasPerm('replyToDirectives') && (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-black text-slate-700 dark:text-slate-300 mb-2">سجل الردود والمناقشات</h4>
                  <p className="text-xs text-slate-500">لا توجد ردود مسجلة حالياً.</p>
                </div>
              )}
            </div>
          </div>
        )}\n"""
    content = content.replace(directives_old.group(0), new_directives)


# Complaints Tab Replacement
complaints_old = re.search(r"\{activeTab === 'complaints'.*?\}\)\n", content, flags=re.DOTALL)
if complaints_old:
    new_complaints = """{activeTab === 'complaints' && (hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')) && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white">سجل الشكاوى</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">متابعة شكاوى المواطنين والمستهلكين ضمن قاطع المسؤولية</p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {hasPerm('showPublicEvalsPage') && (
                <button 
                  onClick={() => setComplaintTab('citizens')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${complaintTab === 'citizens' ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <Compass className="w-4 h-4" />
                  شكاوى المواطنين
                </button>
              )}
              {hasPerm('showDeliveryPage') && (
                <button 
                  onClick={() => setComplaintTab('delivery')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${complaintTab === 'delivery' ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                  <Package className="w-4 h-4" />
                  شكاوى خدمة التوصيل
                </button>
              )}
            </div>

            <div className="glassmorphic-card p-5 space-y-4">
              {complaintTab === 'citizens' && hasPerm('showPublicEvalsPage') && (
                <>
                  <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                    <h3 className="text-xs font-black text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                      <span>📩 بلاغات وشكاوى المواطنين والمستهلكين</span>
                    </h3>
                    <span className="text-[10px] bg-teal-500 text-white px-2 py-0.5 rounded-lg font-black">{teamReports.length} شكوى</span>
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {teamReports.map((r) => (
                      <div key={r.id} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/20 relative overflow-hidden transition-all hover:scale-[1.01]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black text-slate-800 dark:text-white">{r.establishmentName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${r.type === 'food_poisoning' ? 'bg-red-100 text-red-600' : r.type === 'hygiene' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            {r.type === 'food_poisoning' ? 'اشتباه تسمم غذائي' : r.type === 'hygiene' ? 'مخالفة شروط صحية' : 'مخالفة تسعيرة/غش'}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">{r.description}</p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400">{new Date(r.timestamp).toLocaleString('ar-IQ')}</span>
                          <button onClick={() => { notify('تم بدء التحقيق في الشكوى', 'success'); }} className="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-600 hover:bg-teal-100 rounded-lg px-3 py-1 font-black transition-colors">
                            بدء التحقيق 🔍
                          </button>
                        </div>
                      </div>
                    ))}
                    {teamReports.length === 0 && (
                      <div className="text-center p-8 text-slate-400 font-bold text-xs bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl">
                        لا توجد شكاوى نشطة في هذا القطاع حالياً.
                      </div>
                    )}
                  </div>
                </>
              )}
              {complaintTab === 'delivery' && hasPerm('showDeliveryPage') && (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="font-black text-slate-700 dark:text-slate-300 mb-2">شكاوى ومتابعة خدمة التوصيل</h4>
                  <p className="text-xs text-slate-500">لا توجد شكاوى أو بلاغات بخصوص خدمات التوصيل والمندوبين في الوقت الحالي.</p>
                </div>
              )}
            </div>
          </div>
        )}\n"""
    content = content.replace(complaints_old.group(0), new_complaints)


with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("TeamDashboard updated")
