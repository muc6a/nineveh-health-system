    if (activeTab === 'directives' && !hasPerm('showDirectivesPage')) needsRedirect = true;
    if (activeTab === 'complaints' && !hasPerm('showPublicEvalsPage')) needsRedirect = true;

    if (needsRedirect) {
      const newTab = getInitialExecutiveTab();
      setActiveTab(newTab || 'none');
    }

    if (executiveTab === 'establishments' && !hasPerm('manageEstablishments')) {
      setExecutiveTab('dashboard');
    }
  }, [user?.permissions, activeTab, executiveTab]);

  // Auto clear directive notifications when in directives tab
  useEffect(() => {
    if (activeTab === 'directives' && systemNotifications?.length > 0) {
      const hasUnread = systemNotifications.some(n => {
        const isMine = n.targetRole === 'all' || n.targetRole === user?.role || n.targetRole === user?.id;
        if (!isMine || n.isRead) return false;
        const t = n.title || '';
        return t.includes('قرار') || t.includes('تبليغ') || t.includes('توجيه') || t.includes('SOS') || t.includes('استغاثة');
      });

      if (hasUnread) {
        setSystemNotifications(prev => prev.map(n => {
          const isMine = n.targetRole === 'all' || n.targetRole === user?.role || n.targetRole === user?.id;
          const t = n.title || '';
          const isDirective = t.includes('قرار') || t.includes('تبليغ') || t.includes('توجيه') || t.includes('SOS') || t.includes('استغاثة');
          if (isMine && isDirective && !n.isRead) {
            return { ...n, isRead: true };
          }
          return n;
        }));
      }
    }
  }, [activeTab, systemNotifications, user, setSystemNotifications]);

  // Listen for navigation events from NotificationBell
  React.useEffect(() => {
    const handleNav = () => {
      setActiveTab('operations_room');
    };
    const handleNavDirectives = () => {
      setExecutiveTab('dashboard');
      setActiveTab('directives');
    };
    window.addEventListener('navToPenalties', handleNav);
    window.addEventListener('navToDirectives', handleNavDirectives);
    return () => {
      window.removeEventListener('navToPenalties', handleNav);
      window.removeEventListener('navToDirectives', handleNavDirectives);
    };
  }, []);

  // Send directives form states
  const [targetRecipient, setTargetRecipient] = useState('all');
  const [directiveText, setDirectiveText] = useState('');
  const [directiveSuccessMsg, setDirectiveSuccessMsg] = useState('');

  const handleRedirectComplaint = (complaint) => {
    const targetTeam = teams.find(t => t.sector?.includes(complaint.sector) || complaint.sector?.includes(t.sector)) || teams[0];
    if (targetTeam) {
      const newTask = {
        id: 'task_comp_' + Date.now(),
        title: `معالجة شكوى - ${complaint.establishmentName}`,
        description: `ورد تبليغ من بوابة المواطن: "${complaint.details}". يرجى التوجه للمكان ومعالجة الأمر.`,
        targetEstId: complaint.establishmentId || 'unknown',
        assignedTo: 'all_team',
        teamId: targetTeam.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      setReports(prev => prev.map(r => r.id === complaint.id ? { ...r, forwarded: true, forwardedAt: new Date().toISOString() } : r));
      notify(`تم إعادة توجيه الشكوى إلى فريق ${targetTeam.name} بنجاح وإضافتها لمهامهم`, 'success');
    } else {
      notify('لم يتم العثور على فريق مطابق لهذا القطاع', 'error');
    }
  };

  const handleDispatch = (tId, eId) => {
    if (!eId || !tId) {
      notify('الرجاء تحديد المنشأة واللجنة المطلوبة', 'error');
      return;
    }
    const est = establishments.find(e => e.id === eId);
    const team = teams.find(t => t.id === tId);
    
    setDispatches(prev => [...prev, {
      id: 'disp_' + Date.now(),
      estId: est.id,
      estName: est.name,
      teamId: team.id,
      date: new Date().toISOString(),
      status: 'pending'
    }]);

    notify(`تم إرسال أمر توجيه عاجل إلى ${team.name} لزيارة ${est.name} فوراً!`, 'success', true);
  };

  const handleSendDirective = (e) => {
    e.preventDefault();
    if (!directiveText) return;
    
    // Format sender name properly
    const senderName = user?.role === 'director' 
      ? `المدير العام لصحّة نينوى (${user?.name || 'د. عماد'})` 
      : `إدارة الصحة العامة (${user?.name || 'المدير العام'})`;

    // Send directive to target recipient
    addDirective(targetRecipient, directiveText, senderName, user?.id || user?.role);
    notify('تم إرسال الأمر الإداري إلى اللجان المعنية بنجاح', 'success');
    setDirectiveSuccessMsg('✔️ تم إرسال الأمر الإداري والتبليغ فوراً إلى الجهة المعنية.');
    setDirectiveText('');
    setTimeout(() => {
      setDirectiveSuccessMsg('');
    }, 3000);
  };

  // Auto-linking: filter teams based on logged-in director's assigned sector
  const isDirectorGeneral = ['director', 'admin', 'public_health', 'central_director', 'committee_director'].includes(user?.role);
  const allowedTeams = isDirectorGeneral 
    ? (teams || []) 
    : (teams || []).filter(t => t.sector?.includes(user?.sector) || user?.sector?.includes(t.sector));

  // Compute active team filter
  const selectedTeam = allowedTeams.find(t => t.id === selectedTeamId);
  
  // If the director is restricted to a sector and hasn't selected a team, their default targetSector is their own sector
  const defaultTargetSector = isDirectorGeneral ? null : user?.sector;
  const targetSector = selectedTeam ? selectedTeam.sector : defaultTargetSector;

  // Match sector helper
  const matchSector = (tSec, eSec) => {
    if (!tSec || !eSec) return false;
    const cleanT = tSec.replace(/^قضاء\s+/i, '').replace(/^قاطع\s+/i, '').trim();
    const cleanE = eSec.replace(/^قضاء\s+/i, '').replace(/^قاطع\s+/i, '').trim();
    return cleanT.includes(cleanE) || cleanE.includes(cleanT);
  };

  // Filter establishments based on selected team sector
  const filteredEsts = targetSector && targetSector !== 'الكل'
    ? (establishments || []).filter(e => matchSector(targetSector, e.sector))
    : (establishments || []);

  // Compute Chart 1 data (Inspected vs Uninspected)
  const inspectedCount = filteredEsts.filter(e => e.lastInspection !== 'لم يزر بعد').length;
  const uninspectedCount = filteredEsts.filter(e => e.lastInspection === 'لم يزر بعد').length;
  
  const chart1Data = [
    { label: 'تم تقييمها وإصدار QR', value: inspectedCount, color: '#0D9488', key: 'green' },
    { label: 'غير مزارة هذا الشهر', value: uninspectedCount, color: '#DC2626', key: 'red' }
  ];

  // Compute Chart 2 data (Density Map - establishments count per sub-neighborhood/sector)
  const sectorCounts = filteredEsts.reduce((acc, curr) => {
    acc[curr.sector] = (acc[curr.sector] || 0) + 1;
    return acc;
  }, {});

  const chart2Data = Object.keys(sectorCounts).map((sectorName, idx) => {
    const colors = ['#1E3A8A', '#0D9488', '#F59E0B', '#6366F1', '#EC4899'];
    return {
      label: `قطاع ${sectorName}`,
      value: sectorCounts[sectorName],
      color: colors[idx % colors.length]
--
                  isActive: executiveTab === 'dashboard' && activeTab === 'directives',
                  showCondition: true
                },
                complaints: {
                  label: 'الشكاوى',
                  icon: ShieldAlert,
                  iconColorClass: 'text-red-500',
                  activeBgClass: 'bg-red-600 text-white shadow-md shadow-red-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('complaints'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'complaints',
                  showCondition: hasPerm('showPublicEvalsPage') || hasPerm('showDeliveryPage')
                },
                lab_decisions: {
                  label: 'قرارات المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-fuchsia-500',
                  activeBgClass: 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/10',
                  permission: 'authenticatePenalties',
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('lab_results'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'lab_results',
                  showCondition: true
                },
                lab_dashboard: {
                  label: 'إدارة المختبر',
                  icon: FlaskConical,
                  iconColorClass: 'text-indigo-500',
                  activeBgClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10',
                  permission: null,
                  onClick: () => { navigate('/dashboard/lab'); },
                  isActive: false,
                  showCondition: hasPerm('receiveSamples') || hasPerm('enterLabResults') || hasPerm('labArchive')
                },
                financials: {
                  label: PERMISSIONS_TABS.find(t => t.id === 'financials')?.label || 'المالية',
                  icon: Database,
                  iconColorClass: 'text-emerald-500',
                  activeBgClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10',
                  permission: null,
                  onClick: () => { setExecutiveTab('dashboard'); setActiveTab('financials'); },
                  isActive: executiveTab === 'dashboard' && activeTab === 'financials',
                  showCondition: hasPerm('financialReports') || hasPerm('payFines') || hasPerm('dailyInventory')
                },
                establishments: {
                  label: 'إدارة المنشآت',
                  icon: Building,
                  iconColorClass: 'text-blue-500',
                  activeBgClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/10',
                  permission: 'manageEstablishments',
                  onClick: () => { setExecutiveTab('establishments'); setSelectedTeamId(''); },
                  isActive: executiveTab === 'establishments',
                  showCondition: true
                }
              };

              const savedTabOrder = uiPreferences?.tabOrder || Object.keys(tabConfig);
              const tabOrder = [...new Set([...savedTabOrder, ...Object.keys(tabConfig)])];
              return tabOrder.map(tabKey => {
                const config = tabConfig[tabKey];
                if (!config || (config.permission && !hasPerm(config.permission)) || !config.showCondition) return null;
                const Icon = config.icon;
                
                return (
                  <button
                    key={tabKey}
                    onClick={config.onClick}
                    className={`w-full text-right px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-3 ${
                      config.isActive
                        ? config.activeBgClass
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${!config.isActive && config.iconColorClass ? config.iconColorClass : ''}`} />
                    <span>{config.label}</span>
                  </button>
                );
              });
            })()}
          </div>

        {/* Logout at bottom - Sticky */}
        <div className="pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-800/50 sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md pb-6 -mb-6 space-y-2">
          <button 
            onClick={() => setShowDisplayPrefsModal(true)}
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>تخصيص العرض</span>
          </button>
          <button
            onClick={globalLogout}
            className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج الآمن</span>
          </button>
        </div>
      </aside>
        )}

      {/* Main Panel Canvas */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Top bar for small screens */}
        <div className="md:hidden flex items-center justify-between p-4 mb-6 glassmorphic-card rounded-2xl">
          <AnimatedLogo variant="sidebar" className="border-none p-0" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setShowDisplayPrefsModal(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={globalLogout}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="md:hidden mb-6">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2 mr-1">القائمة السريعة</label>
          <select
            value={executiveTab === 'establishments' ? 'establishments' : (activeTab === 'strategic' ? selectedTeamId : activeTab)}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'establishments') {
                setExecutiveTab('establishments');
              } else if (val === 'operations_room' || val === 'directives' || val === 'complaints' || val === 'team_reports') {
                setExecutiveTab('dashboard');
                setActiveTab(val);
                if (val === 'team_reports' && (!selectedTeamId || selectedTeamId === 'all')) {
                  setSelectedTeamId(allowedTeams[0]?.id);
                }
              } else {
                setExecutiveTab('dashboard');
                setSelectedTeamId(val);
                setActiveTab('strategic');
              }
            }}
            className="w-full p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200"
          >
            {hasPerm('showMainDashboard') && (
              <option value="all">📊 اللوحة الرئيسية (الاستراتيجية)</option>
            )}
            {hasPerm('showFieldTeamsStats') && allowedTeams.length > 0 && (
              <option value="team_reports">👥 تقارير الفرق الميدانية</option>
            )}
            {hasPerm('sendDirective') && (
--
              {activeTab === 'strategic' ? '⚙️' : activeTab === 'establishments' ? '🏢' : activeTab === 'directives' ? '📢' : activeTab === 'complaints' ? '⚖️' : activeTab === 'field_dispatch' ? '🚀' : activeTab === 'lab_results' ? '🧪' : '💼'}
            </span>
            <div>
              <h2 className="text-xs font-black text-slate-800 dark:text-white">
                {activeTab === 'establishments' ? (PERMISSIONS_TABS.find(t => t.id === 'establishments')?.label || 'المنشآت') : 
                 activeTab === 'directives' ? 'التبليغات' : 
                 activeTab === 'complaints' ? 'شكاوى المواطنين' :
                 
                 activeTab === 'lab_results' ? 'قرارات المختبر' :
                 activeTab === 'team_reports' ? `تقارير ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'الفريق الميداني'}` :
                 (activeTab === 'none' ? (PERMISSIONS_TABS.find(t => t.id === 'advanced')?.label || 'الإدارة المتقدمة') : (selectedTeamId === 'all' ? 'الملخص الإحصائي العام للمحافظة' : `إحصائيات ${allowedTeams.find(t => t.id === selectedTeamId)?.name || 'المنظومة'}`))}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">
                {activeTab === 'establishments' ? 'عرض وتعديل والتحكم الكامل بالمنشآت المضافة' : 
                 activeTab === 'directives' ? 'إرسال الأوامر والتعميمات للفرق الرقابية' :
                 activeTab === 'complaints' ? 'عرض شكاوى وملاحظات المواطنين الواردة من خلال مسح QR' :
                 
                 (activeTab === 'none' ? 'نظام إدارة الرقابة الصحية الموحد - محافظة نينوى' : 'عرض البيانات والأرقام الرقابية المحدثة في الوقت الفعلي للمنظومة')}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
            <NotificationBell />
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
              <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="text-slate-300">|</span>
              <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
              <WeatherWidget variant="full" />
            </div>
            {hasPerm('exportData') && (
              <button 
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] transition-all shadow-md flex items-center gap-1.5 no-print"
              >
                🖨️ طباعة الموقف الإحصائي اليومي
              </button>
            )}
          </div>
        </div>



        {/* Tab Content Rendering */}
        {executiveTab === 'establishments' && hasPerm('manageEstablishments') ? (
          <EstablishmentsManager />
        ) : (
          <>
        {activeTab === 'operations_room' && <OperationsRoom />}

        
        {activeTab === 'financials' && <FinancialReports />}
        
        {activeTab !== 'operations_room' && activeTab !== 'financials' && (
          <>
            {/* Welcome / No Permissions State */}
        {!hasPerm('showMainDashboard') && !hasPerm('manageEstablishments') && !hasPerm('showReportsPage') && !hasPerm('showDirectivesPage') && !hasPerm('showPublicEvalsPage') && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <ShieldAlert className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white">لا توجد صلاحيات مخصصة</h2>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              عذراً، لم يتم منحك أي صلاحيات لعرض الصفحات في هذا الحساب الإداري. جميع المؤشرات والمهام محجوبة كإجراء احترازي. يرجى مراجعة مدير النظام (Super Admin) لتفعيل الأذونات اللازمة عبر الرئيسية.
            </p>
          </div>
        )}

        {/* Dynamic Tab Switching Content */}
        {(activeTab === 'strategic' && hasPerm('showMainDashboard')) || (activeTab === 'team_reports' && hasPerm('showFieldTeamsStats')) ? (
          <div className="space-y-6">
            
            {activeTab === 'team_reports' && (
              <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar hide-scroll-indicator -mx-4 px-4 md:mx-0 md:px-0">
                {allowedTeams.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTeamId(t.id)}
                    className={`shrink-0 px-5 py-3 rounded-xl text-xs font-black transition-all border ${
                      selectedTeamId === t.id 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/30' 
                        : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-[1.02]'
                    }`}
                  >
                    👥 {t.name}
                  </button>
                ))}
              </div>
            )}

            {/* Summary Minimalist 3D Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total establishments */}
          <div 
            onClick={() => setShowCategoryBreakdownModal(true)}
            className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl border border-slate-700/50 cursor-pointer hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 text-right group relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building className="w-32 h-32 text-white" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-teal-400 text-[10px] font-black tracking-wider uppercase bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">منشآت نينوى</span>
              <span className="text-xs text-slate-400">اضغط للمعاينة بالتصنيف 🔍</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">إجمالي المنشآت الخاضعة للرقابة الصحية</h3>
            <span className="text-4xl lg:text-5xl font-black text-white mt-1 block">{filteredEsts.length} <span className="text-sm text-slate-450 font-medium">منشأة مسجلة</span></span>
          </div>

          {/* Card 2: Coverage Ratio */}
          <div 
            className="p-5 rounded-2xl bg-gradient-to-br from-teal-900 to-slate-900 text-white shadow-xl border border-teal-800/40 text-right relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <TrendingUp className="w-32 h-32 text-teal-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-450 text-[10px] font-black tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">نسبة الإنجاز</span>
              <span className="text-emerald-400 text-xs font-bold">مؤشر أداء متميز</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">نسبة تغطية الرقابة الصحية المنجزة</h3>
            <span className="text-4xl lg:text-5xl font-black text-emerald-400 mt-1 block">
              {filteredEsts.length > 0 ? Math.round((inspectedCount / filteredEsts.length) * 100) : 0}%
            </span>
          </div>

          {/* Card 3: Critical Violations */}
          <div 
            className="p-5 rounded-2xl bg-gradient-to-br from-red-900 to-slate-900 text-white shadow-xl border border-red-800/40 text-right relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <AlertTriangle className="w-32 h-32 text-red-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-450 text-[10px] font-black tracking-wider uppercase bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/20">منشآت حرجة</span>
              <span className="text-red-400 text-xs font-bold">تتطلب متابعة</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">إجمالي المخالفات الحرجة غير الملتزمة</h3>
            <span className="text-4xl lg:text-5xl font-black text-red-400 mt-1 block">
              {nonCompliantCount} <span className="text-sm text-red-500/70 font-medium">مخالفة</span>
            </span>
          </div>

          {/* Card 4: Closed Establishments */}
          <div 
            className="p-5 rounded-2xl bg-gradient-to-br from-orange-900 to-slate-900 text-white shadow-xl border border-orange-800/40 text-right relative overflow-hidden"
          >
            <div className="absolute top-2 left-2 opacity-5">
              <AlertTriangle className="w-32 h-32 text-orange-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-450 text-[10px] font-black tracking-wider uppercase bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/20">إغلاق رسمي</span>
              <span className="text-orange-400 text-xs font-bold">محاسبة قانونية</span>
            </div>
            <h3 className="text-xs text-slate-300 font-bold">إجمالي المنشآت المغلقة للآن</h3>
            <span className="text-4xl lg:text-5xl font-black text-orange-400 mt-1 block">
              {closedRestaurants.length} <span className="text-sm text-orange-500/70 font-medium">منشأة</span>
            </span>
          </div>
        </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
--
        ) : activeTab === 'directives' && hasPerm('showDirectivesPage') ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Direct Command Directive Form */}
            {hasPerm('sendDirective') && (
              <div className="glassmorphic-card p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 text-right rounded-3xl sticky top-6">
                <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3 mb-4">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-white">📢 بوابة الأوامر والتعميمات الإدارية</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">توجيه اللجان الميدانية أو شعب الرقابة بمختلف القطاعات</p>
                  </div>
                </div>

                <form onSubmit={handleSendDirective} className="space-y-4 text-xs font-bold">
                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">الجهة الإدارية المعنية بالأمر</label>
                    <select
                      value={targetRecipient}
                      onChange={(e) => setTargetRecipient(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="all">📢 كافة شعب ولجان التفتيش بالمحافظة</option>
                      {directors?.filter(d => d.id !== user?.id && d.active).map(d => (
                        <option key={d.id} value={d.id}>👑 {d.title} ({d.name})</option>
                      ))}
                      {allowedTeams.map(t => (
                        <option key={t.id} value={t.id}>👥 {t.name} ({t.sector})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">الأولوية ودرجة الإلحاح</label>
                    <select
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500"
                    >
                      <option value="high">🚨 عاجل وهام جداً - تنفيذ فوري</option>
                      <option value="medium">⚠️ متابعة روتينية يومية</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 dark:text-slate-400">نص التوجيه / الأمر الرقابي والتعليمات الوزارية</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="اكتب التوجيه هنا..."
                      value={directiveText}
                      onChange={(e) => setDirectiveText(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال وتعميم الأمر الإداري فوراً 🚀</span>
                  </button>
                </form>

                {directiveSuccessMsg && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center font-bold text-[10px] animate-pulse">
                    {directiveSuccessMsg}
                  </div>
                )}
              </div>
            )}
            
            {/* Directives Inbox/Outbox List */}
            <div className="glassmorphic-card p-5 border border-amber-500/20 bg-slate-900 rounded-3xl max-h-[600px] overflow-y-auto">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4 text-right">
                <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  التبليغات
                </h3>
              </div>
              <div className="space-y-4 text-right pr-1">
                {(directives || []).filter(d => d.teamId === user?.role || d.teamId === user?.id || d.teamId === 'all' || d.sender?.includes(user?.name)).length > 0 ? (
                  (directives || []).filter(d => d.teamId === user?.role || d.teamId === user?.id || d.teamId === 'all' || d.sender?.includes(user?.name)).map((dir, idx) => (
                    <div key={idx} className={`${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-900/40 border-teal-500 border-2 shadow-teal-500/20' : 'bg-slate-800 border-slate-700/60'} p-4 rounded-2xl border shadow-md transition-all relative overflow-hidden`}>
                      {dir.text.startsWith('رد على تبليغ:') && (
                        <div className="absolute top-0 right-0 h-full w-1.5 bg-teal-500"></div>
                      )}
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <div>
                          <h4 className="text-xs font-black text-white">من: {dir.sender}</h4>
                          <span className="text-[10px] text-slate-400">إلى: {dir.teamId === 'all' ? 'جميع الجهات والفرق' : (teams.find(t => t.id === dir.teamId)?.name || directors.find(d => d.id === dir.teamId)?.title || dir.teamId)}</span>
                        </div>
                        <span className="bg-slate-900 text-slate-300 text-[9px] font-bold px-2 py-1 rounded-md border border-slate-700/50">
                          {dir.date || 'تاريخ غير محدد'}
                        </span>
                      </div>
                      <p className={`text-xs font-bold p-3 rounded-xl border mt-2 ${dir.text.startsWith('رد على تبليغ:') ? 'bg-teal-950/50 border-teal-800/50 text-teal-100' : 'bg-slate-900/50 border-slate-700 text-slate-300'}`}>
                        {dir.text}
                      </p>
                      
                      {/* Reply button for received directives */}
                      {dir.senderId !== user?.id && dir.senderId !== user?.role && hasPerm('replyDirective') && (
                        <div className="mt-3">
                          {replyingTo === dir.id ? (
                            <div className="flex gap-2 items-center bg-slate-900 p-2 rounded-xl border border-slate-700/50">
                              <input 
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="اكتب ردك هنا..."
                                className="flex-1 bg-transparent border-none outline-none text-xs text-slate-200"
                              />
                              <button 
                                onClick={() => {
                                  if (replyText.trim()) {
                                    const senderName = user?.role === 'director' ? `المدير العام (${user?.name})` : `الإدارة (${user?.name})`;
                                    addDirective(dir.senderId || 'admin', `رد على تبليغ: ${replyText}`, senderName, user?.id || user?.role);
                                    setReplyingTo(null);
                                    setReplyText('');
                                    notify('تم إرسال الرد بنجاح', 'success');
                                  }
                                }}
                                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow cursor-pointer transition-all"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => { setReplyingTo(dir.id); setReplyText(''); }}
                              className="text-[10px] font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer border border-amber-500/20"
                            >
                              رد / تأكيد استلام
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-slate-500 font-bold text-xs">لا توجد تبليغات مسجلة حالياً</div>
                )}
              </div>
            </div>
          </div>
            
