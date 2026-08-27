      {/* PROFESSIONAL PERMISSIONS HUB MODAL */}
      {showPermissionsModal && selectedPermissionsAccount && (() => {
        const PERMISSIONS_TABS = [
          { id: 'establishments', label: 'إدارة المنشآت', icon: <Building className="w-4 h-4"/>, keys: ['manageEstablishments', 'createEst', 'editEst', 'deleteEst', 'addEval'] },
          { id: 'pages', label: 'صفحات النظام', icon: <Compass className="w-4 h-4"/>, keys: ['showMainDashboard', 'showReportsPage', 'showDirectivesPage', 'showDeliveryPage', 'showPublicEvalsPage'] },
          { id: 'directives', label: 'التبليغات', icon: <Mail className="w-4 h-4"/>, keys: ['sendDirective', 'replyDirective'] },
          { id: 'penalties', label: 'العقوبات والإغلاقات', icon: <ShieldAlert className="w-4 h-4 text-red-400"/>, keys: ['issueFine', 'closeEst', 'reopenEst'] },
          { id: 'advanced', label: 'إدارة متقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['manageComplaints', 'exportData', 'viewAuditLogs', 'manageAccounts', 'manageSettings', 'backupData'] },
        ];

        const PERMISSION_DETAILS = {
          manageEstablishments: { title: 'إدارة المنشآت (المفتاح الرئيسي)', desc: 'بإعطاء هذا الإذن، سيتمكن هذا الحساب من رؤية قسم المنشآت والمطاعم بالكامل والوصول إليه.' },
          createEst: { title: 'إضافة منشأة جديدة', desc: 'هذا الإذن يتيح للحساب إمكانية تسجيل وإضافة مطاعم أو كافيهات أو منشآت جديدة إلى النظام.' },
          editEst: { title: 'تعديل بيانات المنشأة', desc: 'يتيح للحساب صلاحية الدخول لبيانات أي مطعم مسجل وتحديث معلوماته (كاسم المدير، رقم الهاتف، والتراخيص).' },
          deleteEst: { title: 'حذف منشأة نهائياً', desc: 'إذن خطير: يسمح لهذا الحساب بشطب ومسح المنشأة نهائياً من قاعدة بيانات النظام.' },
          addEval: { title: 'إضافة كشف صحي', desc: 'يتيح للحساب صلاحية إجراء جولات تفتيشية وتسجيل نقاط التقييم الصحية للمطاعم.' },
          showMainDashboard: { title: 'اللوحة الرئيسية (الاستراتيجية)', desc: 'يسمح للحساب برؤية الواجهة الاستراتيجية التي تحتوي على الأرقام، المخططات البيانية، ونسب الامتثال العامة.' },
          showReportsPage: { title: 'التقارير الجغرافية', desc: 'يسمح برؤية الخارطة التفاعلية وتوزيع المطاعم على أحياء وأقضية محافظة نينوى.' },
          showDirectivesPage: { title: 'التبليغات والتوجيهات', desc: 'يسمح للحساب بفتح صفحة "التوجيهات" لمشاهدة المراسلات الإدارية الواردة والصادرة.' },
          showDeliveryPage: { title: 'خدمة التوصيل', desc: 'يمنح الحساب صلاحية رؤية صفحة التوصيل لمراقبة ومتابعة عمال الدليفري.' },
          showPublicEvalsPage: { title: 'التقييمات العامة (الشكاوى)', desc: 'يسمح برؤية ومتابعة شكاوى المواطنين التي تصل عبر البوابة العامة أو رمز الـ QR.' },
          sendDirective: { title: 'إرسال تبليغ جديد', desc: 'إذا تم تفعيله، سيتمكن الحساب من كتابة وإرسال أوامر إدارية أو تبليغات للفرق واللجان الميدانية.' },
          replyDirective: { title: 'الرد على التبليغات', desc: 'يسمح للحساب بالرد المباشر والتعليق على التبليغات الواردة من الإدارة.' },
          issueFine: { title: 'إصدار غرامة مالية', desc: 'يمنح هذا الحساب صلاحية فرض غرامات وعقوبات مالية على المطاعم المخالفة وتوثيقها.' },
          closeEst: { title: 'إصدار أمر إغلاق (تشميع)', desc: 'إذن خطير: يعطي الحساب صلاحية اتخاذ قرار بإغلاق المطعم فوراً ومنعه من العمل.' },
          reopenEst: { title: 'إعادة فتح المنشأة', desc: 'يسمح برفع حظر الإغلاق عن المطعم وإعادته لحالة العمل الطبيعية بعد إزالة المخالفة.' },
          manageComplaints: { title: 'إدارة الشكاوى العامة', desc: 'يتيح للحساب صلاحية الرد على شكاوى المواطنين وإغلاقها بعد معالجتها.' },
          exportData: { title: 'تصدير التقارير', desc: 'يسمح بتنزيل بيانات المنظومة وجداول المطاعم على شكل ملفات Excel أو PDF لغرض الأرشفة.' },
          viewAuditLogs: { title: 'سجل النشاطات (المراقبة)', desc: 'يسمح للحساب برؤية سجل المراقبة لمعرفة "من قام بماذا" داخل النظام (متى تم التعديل ومن عدّله).' },
          manageAccounts: { title: 'إدارة الحسابات الميدانية', desc: 'يعطي الحساب القدرة على رؤية حسابات الفرق واللجان الميدانية في نينوى.' },
          manageSettings: { title: 'إعدادات النظام والبنود', desc: 'إذن خطير جداً: يسمح بتعديل بنود الكشف الـ 30 الأساسية وأوزانها وإعدادات المنظومة ككل.' },
          backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' }
        };

        const totalPerms = Object.keys(DEFAULT_PERMISSIONS).length;
        const grantedPerms = Object.keys(DEFAULT_PERMISSIONS).filter(k => selectedPermissionsAccount.permissions?.[k]).length;
        const progressPercentage = Math.round((grantedPerms / totalPerms) * 100);

        const handleGrantAll = () => {
          setSelectedPermissionsAccount(prev => {
            const allTrue = {};
            Object.keys(DEFAULT_PERMISSIONS).forEach(k => allTrue[k] = true);
            return { ...prev, permissions: allTrue };
          });
        };

        const handleRevokeAll = () => {
          setSelectedPermissionsAccount(prev => {
            const allFalse = {};
            Object.keys(DEFAULT_PERMISSIONS).forEach(k => allFalse[k] = false);
            return { ...prev, permissions: allFalse };
          });
        };

        const activeTabObj = PERMISSIONS_TABS.find(t => t.id === activePermissionsTab);

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] relative overflow-hidden flex flex-col md:flex-row text-right max-h-[85vh]">
              
              {/* Right Sidebar: Tabs & Stats */}
              <div className="w-full md:w-1/3 bg-slate-100/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-white/5 p-6 flex flex-col relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 flex items-center gap-2 drop-shadow-sm">
                    <Settings className="w-5 h-5 text-purple-400" /> مركز الأذونات
                  </h3>
                  <button onClick={() => setShowPermissionsModal(false)} className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                  <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">الحساب المستهدف</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mb-5 truncate">{selectedPermissionsAccount.name}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black">
                      <span className="text-teal-600 dark:text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">ممنوح ({grantedPerms})</span>
                      <span className="text-slate-500">من {totalPerms} إذن</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800/80 ring-1 ring-slate-300 dark:ring-white/5 rounded-full h-2 overflow-hidden shadow-inner">
                      <div className="bg-gradient-to-l from-purple-500 via-indigo-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {PERMISSIONS_TABS.filter(tab => {
                    if (tab.id === 'establishments' && (selectedPermissionsAccount?.role === 'director' || selectedPermissionsAccount?.role === 'central_director')) {
                      return false;
                    }
                    return true;
                  }).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActivePermissionsTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 cursor-pointer text-xs font-black relative overflow-hidden ${activePermissionsTab === tab.id ? 'bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-purple-300 border border-purple-500/30 shadow-[inset_0_0_15px_rgba(168,85,247,0.15)] translate-x-1' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'}`}
                    >
                      <div className={`p-1.5 rounded-lg ${activePermissionsTab === tab.id ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {tab.icon}
                      </div>
                      {tab.label}
                      {activePermissionsTab === tab.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 space-y-3">
                  <button onClick={handleGrantAll} className="w-full py-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-extrabold text-[11px] transition-all cursor-pointer border border-teal-500/20 hover:border-teal-500/40 hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                    + منح كافة الصلاحيات
                  </button>
                  <button onClick={handleRevokeAll} className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-extrabold text-[11px] transition-all cursor-pointer border border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(248,113,113,0.2)]">
                    - سحب كافة الصلاحيات
                  </button>
                </div>
              </div>

              {/* Left Content Area: Toggle Switches */}
              <div className="w-full md:w-2/3 p-8 flex flex-col h-full bg-slate-50/80 dark:bg-slate-900/40 relative z-10">
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-white/5">
                  <h4 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-3 drop-shadow-md">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-purple-600 dark:text-purple-400">
                      {activeTabObj?.icon}
                    </div>
                    {activeTabObj?.label}
                  </h4>
                  <button onClick={() => setShowPermissionsModal(false)} className="hidden md:flex p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all items-center justify-center group">
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-3 space-y-3 custom-scrollbar">
                  {activeTabObj?.keys.map(key => {
                    const detail = PERMISSION_DETAILS[key];
                    const isGranted = !!selectedPermissionsAccount.permissions?.[key];
                    return (
                      <div key={key} onClick={() => togglePermission(key)} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${isGranted ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-500/40 shadow-[0_0_20px_-5px_rgba(168,85,247,0.1)] dark:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]' : 'bg-white/60 dark:bg-slate-800/40 border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-white/10'}`}>
                        {isGranted && <div className="absolute right-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>}
                        
                        <div className="flex flex-col pl-4 transition-transform duration-300 group-hover:-translate-x-1">
                          <span className={`text-sm font-black mb-1.5 transition-colors ${isGranted ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-200'}`}>{detail.title}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{detail.desc}</span>
                        </div>
                        
                        <div className={`w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 border ${isGranted ? 'bg-purple-500 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-300 dark:bg-slate-700/80 border-slate-400 dark:border-slate-600 shadow-inner'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all duration-300 shadow-md ${isGranted ? 'left-1' : 'left-[26px]'}`}></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {activePermissionsTab === 'directives' && (
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-400/90 font-bold leading-relaxed">
                        تنويه: إطفاء إذن الإرسال والرد يكتسب من خلاله الحساب "صلاحية المشاهدة فقط" للتبليغات الموجهة له دون إمكانية الرد عليها أو إرسال تبليغات جديدة.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/5">
                  <button onClick={handleSavePermissions} className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm transition-all shadow-[0_10px_25px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 active:translate-y-0">
                    حفظ واعتماد صلاحيات الحساب
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}
