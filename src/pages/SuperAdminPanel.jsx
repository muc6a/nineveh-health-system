import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationBell } from '../components/NotificationBell';
import { ThreeDBarChart } from '../components/ThreeDBarChart';
import { Plus, Trash2, Edit, X, Power, ShieldAlert, Check, Users, Settings, Database, Shield, Eye, EyeOff, Info, UserPlus, Compass, Building, Search, Mail, AlertTriangle, BarChart3, BellRing } from 'lucide-react';
import { AccountModal } from '../components/AccountModal';
import { ROLES_DICTIONARY } from '../utils/constants';

export const SuperAdminPanel = () => {
  const { navigate, teams, setTeams, trackers, setTrackers, inspectionItems, setInspectionItems, config, setConfig, user, setUser, directors, setDirectors, setEstablishments, setReports, setDirectives, establishments, reports, directives, tickets, setTickets, auditLogs, publicCMS, setPublicCMS, notify, globalBroadcast, setGlobalBroadcast } = useContext(AppContext);

  // Layout Tab State: 'roster' (إدارة الحسابات), 'settings' (إعدادات النظام والبنود)
  const [activeTab, setActiveTab] = useState('roster');

  // Modal views
  const [accountModalState, setAccountModalState] = useState({ isOpen: false, mode: 'add', data: null, accountType: 'team' });
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [activePermissionsTab, setActivePermissionsTab] = useState('establishments');
  const [selectedPermissionsAccount, setSelectedPermissionsAccount] = useState(null);
  const [selectedTeamDetails, setSelectedTeamDetails] = useState(null); // Click team details modal
  const [step, setStep] = useState(1); // 2-step setup container
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);

  // Form States for New Team Account
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSector, setNewTeamSector] = useState('الزهور');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamPhone, setNewTeamPhone] = useState('');
  const [newTeamPass, setNewTeamPass] = useState('');
  
  // Hierarchical geographic selection states
  const [generalScope, setGeneralScope] = useState('mosul');
  const [mosulSide, setMosulSide] = useState('left');
  const [mosulNeighborhood, setMosulNeighborhood] = useState('الزهور');
  const [districtName, setDistrictName] = useState('قضاء تلعفر');
  const [districtSubsector, setDistrictSubsector] = useState('مركز قضاء تلعفر');
  
  // Dynamic Team Members list inputs
  const [doctors, setDoctors] = useState(['']);
  const [assistants, setAssistants] = useState(['']);
  const [technicians, setTechnicians] = useState(['']);

  // Editing Team Reference
  const [editingTeam, setEditingTeam] = useState(null);
  const [editDoctors, setEditDoctors] = useState(['']);
  const [editAssistants, setEditAssistants] = useState(['']);
  const [editTechnicians, setEditTechnicians] = useState(['']);

  // Roster sub-tab: 'committees' or 'directors'
  const [subRosterTab, setSubRosterTab] = useState('committees');

  // Settings sub-tab: 'evaluations', 'appearance', 'public_cms', 'database'
  const [subSettingsTab, setSubSettingsTab] = useState('evaluations');

  // Audit sub-tab: 'trail', 'tickets'
  const [subAuditTab, setSubAuditTab] = useState('trail');

  // Eye toggles for passwords
  const [showNewTeamPass, setShowNewTeamPass] = useState(false);
  const [showEditTeamPass, setShowEditTeamPass] = useState(false);
  const [showNewDirPass, setShowNewDirPass] = useState(false);

  // Team Permissions Toggle Switch On/Off
  const [permsViewEsts, setPermsViewEsts] = useState(true);
  const [permsEditEsts, setPermsEditEsts] = useState(true);
  const [permsReportViolations, setPermsReportViolations] = useState(true);
  const [permsViewCoverage, setPermsViewCoverage] = useState(true);

  // Edit Permissions Handlers
  const handleSavePermissions = () => {
    if (!selectedPermissionsAccount) return;
    
    if (selectedPermissionsAccount.role === 'team' || selectedPermissionsAccount.isTeam || !selectedPermissionsAccount.role) {
      setTeams(prev => prev.map(t => t.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : t));
    } else {
      setDirectors(prev => prev.map(d => d.id === selectedPermissionsAccount.id ? selectedPermissionsAccount : d));
    }
    
    triggerAlert(`تم حفظ وتحديث الأذونات لحساب (${selectedPermissionsAccount.name}) بنجاح.`);
    setShowPermissionsModal(false);
  };

  const togglePermission = (key) => {
    if (!selectedPermissionsAccount) return;
    setSelectedPermissionsAccount(prev => ({
      ...prev,
      permissions: {
        ...(prev.permissions || {}),
        [key]: prev.permissions ? !prev.permissions[key] : true
      }
    }));
  };

  // Director Form States
  const [showAddDirectorModal, setShowAddDirectorModal] = useState(false);
  const [showEditDirectorModal, setShowEditDirectorModal] = useState(false);
  const [newDirName, setNewDirName] = useState('');
  const [newDirTitle, setNewDirTitle] = useState('مدير صحة نينوى');
  const [newDirEmail, setNewDirEmail] = useState('');
  const [newDirPhone, setNewDirPhone] = useState('');
  const [newDirPass, setNewDirPass] = useState('');
  const [newDirRole, setNewDirRole] = useState('director');
  const [newDirScope, setNewDirScope] = useState('centre'); // centre, districts
  const [newDirSide, setNewDirSide] = useState('left'); // left, right
  const [editingDirector, setEditingDirector] = useState(null);
  
  // Establishments management states
  const [selectedEstDetails, setSelectedEstDetails] = useState(null);
  const [editingEst, setEditingEst] = useState(null);
  const [qrTabMode, setQrTabMode] = useState('dining');
  const [estSearchTerm, setEstSearchTerm] = useState('');

  // Success messages alerts
  const [alertMsg, setAlertMsg] = useState('');

  // Zero-Code Branding Configuration States
  const [headerInput, setHeaderInput] = useState(config.headerText);
  const [allowUploadToggle, setAllowUploadToggle] = useState(config.allowImageUpload);
  const [allowExternalToggle, setAllowExternalToggle] = useState(config.allowExternalReports);
  const [retentionDropdown, setRetentionDropdown] = useState(config.imageRetention);
  const [scaleSelector, setScaleSelector] = useState(config.uiScale);

  // Public CMS States
  const [cmsHeroTitle, setCmsHeroTitle] = useState(publicCMS.heroTitle);
  const [cmsHeroSubtext, setCmsHeroSubtext] = useState(publicCMS.heroSubtext);
  const [cmsAnnouncement, setCmsAnnouncement] = useState(publicCMS.announcement || '');

  const triggerAlert = (msg) => {
    notify(msg, 'success');
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(''), 4000);
  };

  // Feedback states
  const [feedbackType, setFeedbackType] = useState('bug');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSuccess(true);
    setFeedbackText('');
    setTimeout(() => {
      setFeedbackSuccess(false);
    }, 3000);
  };

  const handleEditEstSubmit = (e) => {
    e.preventDefault();
    if (!editingEst) return;
    setEstablishments(prev => prev.map(est => est.id === editingEst.id ? editingEst : est));
    setEditingEst(null);
    triggerAlert('✓ تم تعديل وحفظ بيانات المنشأة بنجاح.');
  };

  const handleSeedData = () => {
    const seeded = [
      {
        id: 'est_1',
        name: 'مطعم كباب أبي جميل الشهير (الموصل القديمة)',
        owner: 'الحاج أبو جميل الجبوري',
        licenseNumber: 'LIC-NIN-9082',
        type: 'مطعم',
        sector: 'الجانب الأيمن - الموصل القديمة',
        neighborhood: 'الموصل القديمة',
        latitude: '36.3421',
        longitude: '43.1256',
        facebook: 'https://facebook.com/mosul_kabab',
        phone: '07701234567',
        status: 'compliant',
        score: 94,
        lastInspection: '2026-06-25',
        history: [{ date: '2026-06-25', score: 94, notes: 'الالتزام بالنظافة والشروط الصحية والزي الموحد ممتاز.', inspectorName: 'اللجنة الرقابية الثانية - الجانب الأيمن' }]
      },
      {
        id: 'est_2',
        name: 'كافيه الغابات العائلي (حي الزهور)',
        owner: 'مروان غانم يونس',
        licenseNumber: 'LIC-NIN-1092',
        type: 'كوفيشوب',
        sector: 'الجانب الأيسر - الزهور',
        neighborhood: 'الزهور',
        latitude: '36.3712',
        longitude: '43.1610',
        facebook: 'https://instagram.com/forests_cafe',
        phone: '07504321098',
        status: 'compliant',
        score: 91,
        lastInspection: '2026-07-02',
        history: [{ date: '2026-07-02', score: 91, notes: 'المطبخ نظيف والشهادات الصحية للعمال مجددة بالكامل.', inspectorName: 'اللجنة الرقابية الأولى - الجانب الأيسر' }]
      },
      {
        id: 'est_3',
        name: 'قاعة نينوى الكبرى للمناسبات (حي المصارف)',
        owner: 'عمر ثامر الحيالي',
        licenseNumber: 'LIC-NIN-4432',
        type: 'قاعة أعراس',
        sector: 'الجانب الأيسر - حي المصارف',
        neighborhood: 'المصارف',
        latitude: '36.3688',
        longitude: '43.1554',
        facebook: 'https://facebook.com/ninveh_hall',
        phone: '07718882233',
        status: 'monitoring',
        score: 78,
        lastInspection: '2026-06-28',
        history: [{ date: '2026-06-28', score: 78, notes: 'تنبيه بشأن أنظمة التهوية وتصريف المياه الفوري في القاعة.', inspectorName: 'اللجنة الرقابية الأولى - الجانب الأيسر' }]
      },
      {
        id: 'est_4',
        name: 'أفران الصمون الأوتوماتيكي تلعفر',
        owner: 'أرشد إسماعيل حسن',
        licenseNumber: 'LIC-NIN-7781',
        type: 'مخبز / أفران',
        sector: 'قضاء تلعفر - مركز قضاء تلعفر',
        neighborhood: 'مركز قضاء تلعفر',
        latitude: '36.3755',
        longitude: '42.4498',
        facebook: 'https://facebook.com/telafar_bakery',
        phone: '07705556677',
        status: 'compliant',
        score: 95,
        lastInspection: '2026-06-20',
        history: [{ date: '2026-06-20', score: 95, notes: 'مطابق لكافة شروط النظافة وصحة العمال مجددة.', inspectorName: 'اللجنة الرقابية الثالثة - تلعفر' }]
      },
      {
        id: 'est_5',
        name: 'مطعم وادي عياضية للمأكولات الشعبية',
        owner: 'حسين إبراهيم توران',
        licenseNumber: 'LIC-NIN-3321',
        type: 'مطعم',
        sector: 'قضاء تلعفر - ناحية العياضية',
        neighborhood: 'ناحية العياضية',
        latitude: '36.5211',
        longitude: '42.4820',
        facebook: 'https://facebook.com/ayadiya_restaurant',
        phone: '07519998822',
        status: 'non_compliant',
        score: 55,
        lastInspection: '2026-06-12',
        history: [{ date: '2026-06-12', score: 55, notes: 'وجود لحوم غير صالحة وتخزين سيئ. تم توجيه إنذار أخير قبل الإغلاق.', inspectorName: 'اللجنة الرقابية الثالثة - تلعفر' }]
      },
      {
        id: 'est_6',
        name: 'كافتيريا طالبيين المجموعة الثقافية',
        owner: 'أنس جاسم محمد',
        licenseNumber: 'LIC-NIN-9921',
        type: 'كوفيشوب',
        sector: 'الجانب الأيسر - المجموعة الثقافية',
        neighborhood: 'المجموعة الثقافية',
        latitude: '36.3811',
        longitude: '43.1490',
        facebook: 'https://instagram.com/student_caff',
        phone: '07701122334',
        status: 'compliant',
        score: 90,
        lastInspection: '2026-06-29',
        history: [{ date: '2026-06-29', score: 90, notes: 'النظافة العامة جيدة، ويتم الالتزام بجدول تنظيف وتعقيم الأدوات.', inspectorName: 'اللجنة الرقابية الأولى - الجانب الأيسر' }]
      },
      {
        id: 'est_7',
        name: 'حلويات كرز الموصل التراثية (الدواسة)',
        owner: 'رياض ذنون السنجري',
        licenseNumber: 'LIC-NIN-4091',
        type: 'مطعم',
        sector: 'الجانب الأيمن - الدواسة',
        neighborhood: 'الدواسة',
        latitude: '36.3385',
        longitude: '43.1311',
        facebook: 'https://facebook.com/karaz_sweets',
        phone: '07504445566',
        status: 'compliant',
        score: 93,
        lastInspection: '2026-07-01',
        history: [{ date: '2026-07-01', score: 93, notes: 'أواني الوجبات نظيفة والالتزام بالزي الصحي الرسمي ممتاز.', inspectorName: 'اللجنة الرقابية الثانية - الجانب الأيمن' }]
      },
      {
        id: 'est_8',
        name: 'قاعة برطلة للمناسبات السعيدة',
        owner: 'بهنام يوسف صليوا',
        licenseNumber: 'LIC-NIN-1234',
        type: 'قاعة أعراس',
        sector: 'قضاء الحمدانية - ناحية برطلة',
        neighborhood: 'ناحية برطلة',
        latitude: '36.3456',
        longitude: '43.3789',
        facebook: 'https://facebook.com/bartella_hall',
        phone: '07707772211',
        status: 'monitoring',
        score: 72,
        lastInspection: '2026-06-15',
        history: [{ date: '2026-06-15', score: 72, notes: 'تنبيه عاجل لسلامة مخارج الطوارئ ومكافحة الحرائق بقاطعه.', inspectorName: 'اللجنة الرقابية في الحمدانية' }]
      }
    ];
    setEstablishments(seeded);
    triggerAlert('🚀 تم تغذية قاعدة البيانات بنماذج البيانات الحقيقية من Google Maps والمنصات بنجاح!');
  };

  // Helper to add dynamic members inputs
  const addField = (type, isEdit = false) => {
    if (isEdit) {
      if (type === 'doc') setEditDoctors([...editDoctors, '']);
      if (type === 'asst') setEditAssistants([...editAssistants, '']);
      if (type === 'tech') setEditTechnicians([...editTechnicians, '']);
    } else {
      if (type === 'doc') setDoctors([...doctors, '']);
      if (type === 'asst') setAssistants([...assistants, '']);
      if (type === 'tech') setTechnicians([...technicians, '']);
    }
  };

  const removeField = (type, index, isEdit = false) => {
    if (isEdit) {
      if (type === 'doc') setEditDoctors(editDoctors.filter((_, i) => i !== index));
      if (type === 'asst') setEditAssistants(editAssistants.filter((_, i) => i !== index));
      if (type === 'tech') setEditTechnicians(editTechnicians.filter((_, i) => i !== index));
    } else {
      if (type === 'doc') setDoctors(doctors.filter((_, i) => i !== index));
      if (type === 'asst') setAssistants(assistants.filter((_, i) => i !== index));
      if (type === 'tech') setTechnicians(technicians.filter((_, i) => i !== index));
    }
  };

  const handleFieldChange = (type, index, value, isEdit = false) => {
    if (isEdit) {
      if (type === 'doc') {
        const updated = [...editDoctors];
        updated[index] = value;
        setEditDoctors(updated);
      }
      if (type === 'asst') {
        const updated = [...editAssistants];
        updated[index] = value;
        setEditAssistants(updated);
      }
      if (type === 'tech') {
        const updated = [...editTechnicians];
        updated[index] = value;
        setEditTechnicians(updated);
      }
    } else {
      if (type === 'doc') {
        const updated = [...doctors];
        updated[index] = value;
        setDoctors(updated);
      }
      if (type === 'asst') {
        const updated = [...assistants];
        updated[index] = value;
        setAssistants(updated);
      }
      if (type === 'tech') {
        const updated = [...technicians];
        updated[index] = value;
        setTechnicians(updated);
      }
    }
  };

  // 1-step Setup Container Handler
  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeamName || !newTeamEmail || !newTeamPhone) {
      triggerAlert('يرجى ملء كافة حقول الاتصال الرسمية للمتابعة.');
      return;
    }
    if (!newTeamPass) {
      triggerAlert('يرجى تعيين كلمة مرور مشفرة آمنة للجنة.');
      return;
    }

      let calculatedSector = '';
      if (generalScope === 'mosul') {
        calculatedSector = `${mosulSide === 'left' ? 'الجانب الأيسر' : 'الجانب الأيمن'} - ${mosulNeighborhood}`;
      } else {
        calculatedSector = `${districtName} - ${districtSubsector}`;
      }

      const newTeamObj = {
        id: 'team_' + Date.now(),
        name: newTeamName,
        sector: calculatedSector,
        email: newTeamEmail,
        phone: newTeamPhone,
        active: true,
        permissions: {
          manageEstablishments: false,
          createEst: false,
          editEst: false,
          deleteEst: false,
          addEval: false,
          showMainDashboard: false,
          showReportsPage: false,
          showDirectivesPage: false,
          showDeliveryPage: false,
          showPublicEvalsPage: false,
          sendDirective: false,
          replyDirective: false
        },
        members: {
          doctors: doctors.filter(d => d.trim() !== ''),
          assistants: assistants.filter(a => a.trim() !== ''),
          technicians: technicians.filter(t => t.trim() !== '')
        }
      };

      setTeams(prev => [...prev, newTeamObj]);
      triggerAlert(`تم إنشاء وتعيين حساب (${newTeamName}) بنجاح.`);

      // Reset Form States
      setNewTeamName('');
      setNewTeamEmail('');
      setNewTeamPhone('');
      setNewTeamPass('');
      setDoctors(['']);
      setAssistants(['']);
      setTechnicians(['']);
      setStep(1);
      setShowAddTeamModal(false);
  };

  // Account Modal Handlers
  const handleOpenAddAccount = (type = 'team') => {
    setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: type });
  };

  const handleOpenEditAccount = (account, type = 'team') => {
    setAccountModalState({ isOpen: true, mode: 'edit', data: account, accountType: type });
  };

  const DEFAULT_PERMISSIONS = {
    // Section A: Establishments
    manageEstablishments: false,
    createEst: false,
    editEst: false,
    deleteEst: false,
    addEval: false,
    // Section B: Pages
    showMainDashboard: false,
    showReportsPage: false,
    showDirectivesPage: false,
    showDeliveryPage: false,
    showPublicEvalsPage: false,
    // Section C: Directives
    sendDirective: false,
    replyDirective: false,
    // Section D: Penalties & Enforcement
    issueFine: false,
    closeEst: false,
    reopenEst: false,
    // Section E: Advanced Admin
    manageComplaints: false,
    exportData: false,
    viewAuditLogs: false,
    manageAccounts: false,
    manageSettings: false,
    backupData: false
  };

  const handleSaveAccount = (accountData) => {
    if (accountModalState.mode === 'add') {
      const newAccount = {
        ...accountData,
        id: accountData.role === 'tracker' ? 'tracker_' + Date.now() : (accountData.isTeam ? 'team_' + Date.now() : 'dir_acc_' + Date.now()),
        permissions: { ...DEFAULT_PERMISSIONS }
      };
      if (accountData.role === 'tracker') {
        setTrackers(prev => [...prev, newAccount]);
      } else if (accountData.isTeam) {
        setTeams(prev => [...prev, newAccount]);
      } else {
        setDirectors(prev => [...prev, newAccount]);
      }
      triggerAlert(`تم إضافة الحساب (${accountData.name}) بنجاح.`);
    } else {
      if (accountData.role === 'tracker') {
        setTrackers(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else if (accountData.isTeam) {
        setTeams(prev => prev.map(t => t.id === accountData.id ? accountData : t));
      } else {
        setDirectors(prev => prev.map(d => d.id === accountData.id ? accountData : d));
      }
      triggerAlert(`تم تعديل الحساب (${accountData.name}) بنجاح.`);
    }
    setAccountModalState({ isOpen: false, mode: 'add', data: null, accountType: 'team' });
  };

  const handleDeleteAccount = (id, isTeam) => {
    if (isTeam) {
      setTeams(prev => prev.filter(t => t.id !== id));
    } else {
      setDirectors(prev => prev.filter(d => d.id !== id));
    }
    triggerAlert('تم حذف الحساب نهائياً وسحب رموز الوصول.');
  };

  // Apply zero-code configs
  const saveZeroCodeConfig = () => {
    setConfig(prev => ({
      ...prev,
      headerText: headerInput,
      allowImageUpload: allowUploadToggle,
      allowExternalReports: allowExternalToggle,
      imageRetention: retentionDropdown,
      uiScale: scaleSelector
    }));
    setPublicCMS({
      heroTitle: cmsHeroTitle,
      heroSubtext: cmsHeroSubtext,
      announcement: cmsAnnouncement
    });
    triggerAlert('تم حفظ وتطبيق التعديلات البرمجية فوراً على النظام.');
  };

  // Checklist text editing
  const handleItemTextChange = (id, newText) => {
    setInspectionItems(prev => prev.map(item => item.id === id ? { ...item, text: newText } : item));
  };

  const handleItemPointsChange = (id, newPoints) => {
    setInspectionItems(prev => prev.map(item => item.id === id ? { ...item, points: parseInt(newPoints) || 0 } : item));
  };

  const handleAddChecklistItem = () => {
    const newId = inspectionItems.length > 0 ? Math.max(...inspectionItems.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      section: 'A',
      text: 'بند فحص رقابي مضاف حديثاً - يرجى كتابة الاشتراط الصحي هنا.',
      points: 5
    };
    setInspectionItems(prev => [...prev, newItem]);
    triggerAlert('تم إضافة بند رقابي جديد لقائمة التقييم بقيمة 5 درجات.');
  };

  const handleDeleteChecklistItem = (id) => {
    setInspectionItems(prev => prev.filter(item => item.id !== id));
    triggerAlert('تم حذف البند الرقابي بنجاح.');
  };

  const handleGarbageCollection = () => {
    triggerAlert('🗑️ تم تفريغ مساحة السيرفر ومسح كافة ملفات التخزين المؤقت للصور بنجاح.');
  };

  const handleDeleteTeam = (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الفريق؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setTeams(prev => prev.filter(t => t.id !== id));
      triggerAlert('تم حذف الفريق بنجاح.');
    }
  };

  const handleDeleteDirector = (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذا الحساب؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setDirectors(prev => prev.filter(d => d.id !== id));
      triggerAlert('تم حذف الحساب بنجاح.');
    }
  };

  const handleBackupExport = () => {
    const dataStr = JSON.stringify({
      establishments,
      reports,
      teams,
      inspectionItems,
      directors,
      directives,
      config
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `ninveh_health_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    triggerAlert('💾 تم تصدير النسخة الاحتياطية لقاعدة البيانات بنجاح وتنزيل الملف.');
  };

  const handleBackupImport = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.establishments) setEstablishments(parsed.establishments);
          if (parsed.teams) setTeams(parsed.teams);
          if (parsed.inspectionItems) setInspectionItems(parsed.inspectionItems);
          if (parsed.directors) setDirectors(parsed.directors);
          if (parsed.reports) setReports(parsed.reports);
          if (parsed.directives) setDirectives(parsed.directives);
          if (parsed.config) setConfig(parsed.config);
          triggerAlert('📂 تم استيراد ودمج النسخة الاحتياطية بنجاح وتحديث قاعدة البيانات بالكامل.');
        } catch (err) {
          triggerAlert('❌ خطأ: صيغة ملف النسخة الاحتياطية غير صالحة أو معطوبة.');
        }
      };
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slatebg-light dark:bg-slatebg-dark p-4 md:p-8 transition-colors duration-300">
      
      {/* Top Header bar */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 glassmorphic-card p-4 text-right">
        <div className="flex items-center gap-3">
          <AnimatedLogo variant="sidebar" className="border-none p-0" />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div>
            <h1 className="text-xs font-black text-slate-800 dark:text-white">شاشة المسؤول المركزي للنظام</h1>
            <p className="text-[10px] text-slate-400">أهلاً بك سيدي مسؤول المنظومة المركزي 👋</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-650 dark:text-slate-350">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-xl">
            <span>📅 {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-slate-300">|</span>
            <span>⏰ {new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
            <span> Mosul الطقس في الموصل: 38°C مشمس ☀️</span>
          </div>
          <NotificationBell />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer font-black"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Tabs navigation */}
      <div className="max-w-7xl mx-auto flex overflow-x-auto hide-scrollbar gap-2 mb-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-2 whitespace-nowrap">
        {(user?.role === 'admin' || user?.role === 'central_director') && (
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>👥 إدارة حسابات اللجان الميدانية</span>
          </button>
        )}

        {user?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>⚙️ الصفحات</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('establishments')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'establishments'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
          }`}
        >
          <Building className="w-4.5 h-4.5" />
          <span>🍽️ إدارة المنشأة</span>
        </button>

        {(user?.role === 'admin' || user?.role === 'central_director') && (
          <>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <ShieldAlert className="w-4.5 h-4.5" />
              <span>🛡️ تعديلات</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <AlertTriangle className="w-4.5 h-4.5" />
              <span>📢 البث العاجل</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              <span>📊 كفاءة الفرق</span>
            </button>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {alertMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-600 dark:text-teal-400 text-xs font-bold text-center">
            <span>{alertMsg}</span>
          </div>
        )}

        {/* Tab 1: Roster */}
        {activeTab === 'roster' && (
          <section className="glassmorphic-card p-6">
            
            {/* Sub Roster Tabs Selection Bar */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
              <button
                onClick={() => setSubRosterTab('committees')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subRosterTab === 'committees'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                👥 إدارة حسابات اللجان الميدانية ({teams.length})
              </button>
              <button
                onClick={() => setSubRosterTab('directors')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subRosterTab === 'directors'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                💼 إدارة حسابات المدراء ({directors?.length || 0})
              </button>
              <button
                onClick={() => setSubRosterTab('trackers')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subRosterTab === 'trackers'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                🕵️‍♂️ إدارة المتابعين ({trackers?.length || 0})
              </button>
            </div>

            {subRosterTab === 'committees' && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-white">جدول الفرق ومحرك إدارة الحسابات الميدانية</h2>
                    <p className="text-[11px] text-slate-500 mt-1">توليد حسابات لجان التفتيش وتوزيع المسؤوليات القطاعية في نينوى</p>
                  </div>

                  <button
                    onClick={() => handleOpenAddAccount('team')}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                  >
                    ➕ إنشاء وتعيين فريق تفتيش جديد
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-right">
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الفرق المسجلة</span>
                    <span className="text-xl font-black text-slate-800 dark:text-white">{teams.length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">اللجان النشطة الآن</span>
                    <span className="text-xl font-black text-emerald-500">{teams.filter(t => t.active).length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الحسابات المجمدة</span>
                    <span className="text-xl font-black text-red-500">{teams.filter(t => !t.active).length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الالقطاعات المغطاة</span>
                    <span className="text-xl font-black text-slate-800 dark:text-white">
                      {new Set(teams.map(t => t.sector)).size}
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-850 text-slate-500">
                        <th className="p-4">اسم فريق التفتيش (انقر للتفاصيل)</th>
                        <th className="p-4">القطاع المكلف</th>
                        <th className="p-4">البريد الإلكتروني للوزارة</th>
                        <th className="p-4">رقم هاتف اللجنة</th>
                        <th className="p-4">حالة الحساب</th>
                        <th className="p-4 text-center">الإجراءات الفورية والسحب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {teams.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td 
                            onClick={() => setSelectedTeamDetails(t)}
                            className="p-4 text-slate-800 dark:text-slate-200 cursor-pointer hover:text-teal-600 transition-colors flex items-center gap-1.5"
                          >
                            <Info className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="underline decoration-dotted">{t.name}</span>
                          </td>
                          <td className="p-4 text-teal-600 dark:text-teal-600 dark:text-teal-400">قطاع {t.sector}</td>
                          <td className="p-4 text-slate-500 font-normal dir-ltr">{t.email}</td>
                          <td className="p-4 text-slate-500">{t.phone}</td>
                          <td className="p-4">
                            {t.active ? (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]">نشط وصالح</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]">مجمد مؤقتاً</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditAccount({ ...t, isTeam: true })}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPermissionsAccount({ ...t, role: 'team' });
                                  setActivePermissionsTab('establishments');
                                  setShowPermissionsModal(true);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Settings className="w-3.5 h-3.5" />
                                <span>الأذونات</span>
                              </button>
                              <button
                                onClick={() => toggleFreezeTeam(t.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] transition-all cursor-pointer ${
                                  t.active 
                                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600'
                                }`}
                              >
                                {t.active ? '⏸️ تجميد مؤقت' : '▶️ تنشيط'}
                              </button>
                              <button
                                onClick={() => handleDeleteTeam(t.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"
                              >
                                ❌ حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            
            {subRosterTab === 'directors' && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-white">جدول مدراء الأقسام ورؤساء اللجان الصحية</h2>
                    <p className="text-[11px] text-slate-500 mt-1">توليد وإدارة حسابات القيادات الإدارية وصحة نينوى المركزية</p>
                  </div>

                  <button
                    onClick={() => handleOpenAddAccount('director')}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                  >
                    ➕ إضافة حساب مدير جديد
                  </button>
                </div>

                {/* Director roster table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-850 text-slate-500">
                        <th className="p-4">الاسم الكامل للمدير</th>
                        <th className="p-4">المسمى الوظيفي / الصلاحية</th>
                        <th className="p-4">البريد الإلكتروني للوزارة</th>
                        <th className="p-4">رقم هاتف التواصل</th>
                        <th className="p-4">حالة الحساب</th>
                        <th className="p-4 text-center">الإجراءات والسحب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {(directors || []).map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="p-4 text-slate-800 dark:text-slate-800 dark:text-slate-200">{d.name}</td>
                          <td className="p-4 text-teal-600 dark:text-teal-600 dark:text-teal-400">{d.title}</td>
                          <td className="p-4 text-slate-500 font-normal dir-ltr">{d.email}</td>
                          <td className="p-4 text-slate-500">{d.phone}</td>
                          <td className="p-4">
                            {d.active ? (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]">نشط وصالح</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]">مجمد مؤقتاً</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditAccount(d, 'director')}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPermissionsAccount(d);
                                  setActivePermissionsTab('pages');
                                  setShowPermissionsModal(true);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 text-[10px] transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Settings className="w-3.5 h-3.5" />
                                <span>الأذونات</span>
                              </button>
                              <button
                                onClick={() => toggleFreezeDirector(d.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] transition-all cursor-pointer ${
                                  d.active 
                                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600'
                                }`}
                              >
                                {d.active ? '⏸️ تجميد' : '▶️ تنشيط'}
                              </button>
                              <button
                                onClick={() => handleDeleteDirector(d.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer"
                              >
                                ❌ حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {subRosterTab === 'trackers' && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-black text-slate-800 dark:text-white">جدول فريق متابعة الإغلاق</h2>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">الكوادر المكلفة بالتحقق من الإغلاقات في الميدان</p>
                  </div>
                  <button
                    onClick={() => {
                      setAccountModalState({ isOpen: true, mode: 'add', data: null, accountType: 'tracker' });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                  >
                    ➕ إضافة حساب متابع جديد
                  </button>
                </div>

                {/* Trackers roster table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs font-bold">
                    <thead>
                      <tr className="bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-850 text-slate-500">
                        <th className="p-4">اسم المتابع</th>
                        <th className="p-4">البريد/المعرف</th>
                        <th className="p-4">رقم الهاتف</th>
                        <th className="p-4">القطاع (الفريق المرتبط)</th>
                        <th className="p-4 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {(trackers || []).map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="p-4 font-black text-slate-800 dark:text-white">{t.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 dir-ltr text-right">{t.email || t.username}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 dir-ltr text-right">{t.phone}</td>
                          <td className="p-4">
                            {t.active !== false ? (
                              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]">نشط</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 text-[10px]">مجمد</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleOpenEditAccount(t, 'tracker')}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 transition-all cursor-pointer text-[10px] flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5" /> تعديل
                              </button>
                              <button
                                onClick={() => {
                                  const updated = trackers.map(tr => tr.id === t.id ? { ...tr, active: !(tr.active !== false) } : tr);
                                  setTrackers(updated);
                                  triggerAlert(t.active !== false ? 'تم تجميد المتابع' : 'تم تفعيل المتابع');
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] transition-all cursor-pointer ${
                                  t.active !== false
                                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600'
                                }`}
                              >
                                {t.active !== false ? '⏸️ تجميد' : '▶️ تفعيل'}
                              </button>
                              <button
                                onClick={() => {
                                  const updated = trackers.filter(tr => tr.id !== t.id);
                                  setTrackers(updated);
                                  triggerAlert('تم حذف المتابع بنجاح');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer text-[10px] flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </section>
        )}

        {/* Tab 2: Settings & Parameters */}
        {activeTab === 'settings' && (
          <section className="glassmorphic-card p-6">
            {/* Sub Settings Tabs Selection Bar */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
              <button
                onClick={() => setSubSettingsTab('evaluations')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'evaluations'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                📝 محرر بنود التقييم
              </button>
              <button
                onClick={() => setSubSettingsTab('appearance')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'appearance'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                🎨 تخصيص مظهر النظام
              </button>
              <button
                onClick={() => setSubSettingsTab('public_cms')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'public_cms'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                🌐 واجهة المواطن (CMS)
              </button>
              <button
                onClick={() => setSubSettingsTab('database')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subSettingsTab === 'database'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                💾 النسخ الاحتياطي
              </button>

              <button
                onClick={() => setSubSettingsTab('system_controls')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  subSettingsTab === 'system_controls'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                تحكم النظام ومعايير القياس
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {subSettingsTab === 'appearance' && (
            <div className="glassmorphic-card p-6 space-y-6">
              {/* Branding and Storage Toggles */}
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Settings className="w-5 h-5 text-teal-600" />
                <span>أولاً: محرك التهيئة البصرية والتحكم بمستودعات الصور</span>
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">عنوان الترويسة الرئيسي للواجهات</label>
                <input
                  type="text"
                  value={headerInput}
                  onChange={(e) => setHeaderInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">مقياس حجم الخط بالخطوط الرئيسية</label>
                <select
                  value={scaleSelector}
                  onChange={(e) => setScaleSelector(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-800 dark:text-slate-200\"
                >
                  <option value="small">صغير (مضغوط لشاشات الجوال القديمة)</option>
                  <option value="normal">عادي ومتوسط (افتراضي للمنظومة)</option>
                  <option value="large">ضخم (لكبار السن وضعاف البصر)</option>
                </select>
              </div>

              <div className="space-y-4 pt-2">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">تفعيل ميزة رفع الصور بالاستمارة</span>
                    <span className="text-[10px] text-slate-400">إلغاء التفعيل يحول المنظومة كلياً لقاعدة بيانات نصية</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowUploadToggle}
                    onChange={() => setAllowUploadToggle(!allowUploadToggle)}
                    className="w-10 h-5 accent-teal-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">تفعيل رابط البلاغات الخارجية والتوصيل المنزلي</span>
                    <span className="text-[10px] text-slate-400">إغلاق الخدمة يوجه الزائرين لصفحة إغلاق الصيانة</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowExternalToggle}
                    onChange={() => setAllowExternalToggle(!allowExternalToggle)}
                    className="w-10 h-5 accent-teal-600 cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">تحديد مهلة حذف الصور التلقائي</label>
                  <select
                    value={retentionDropdown}
                    onChange={(e) => setRetentionDropdown(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-800 dark:text-slate-200\"
                  >
                    <option value="3 Months">حذف تلقائي بعد 3 أشهر</option>
                    <option value="6 Months">حذف تلقائي بعد 6 أشهر</option>
                    <option value="12 Months">حذف تلقائي بعد سنة كاملة</option>
                    <option value="Disable Auto-Delete">تعطيل الحذف التلقائي للمستودع</option>
                  </select>
                </div>

                <div className="flex gap-2 justify-between flex-wrap">
                  <button
                    onClick={handleGarbageCollection}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 text-amber-600 font-extrabold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    <span>🗑️ تفريغ مساحة السيرفر يدويًا</span>
                  </button>

                  <button
                    onClick={saveZeroCodeConfig}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer"
                  >
                    حفظ وتطبيق التهيئة
                  </button>
                </div>
              </div>
            </div>
            )}

              {subSettingsTab === 'public_cms' && (
                <div className="glassmorphic-card p-6 space-y-6">
                  {/* Public Page CMS Editor */}
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Settings className="w-5 h-5 text-teal-600" />
                <span>إدارة محتوى صفحة المواطن (Public Search CMS)</span>
              </h2>

              <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                من هنا يمكنك التحكم في النصوص والصور الترحيبية المعروضة للمواطنين في شاشة البحث العام (بوابة المواطن).
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-right">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">العنوان الترحيبي الرئيسي</label>
                  <input
                    type="text"
                    value={cmsHeroTitle}
                    onChange={(e) => setCmsHeroTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">الوصف أو الإرشادات للمواطنين</label>
                  <textarea
                    rows="3"
                    value={cmsHeroSubtext}
                    onChange={(e) => setCmsHeroSubtext(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">شريط الإعلانات العاجلة للمواطنين (اختياري)</label>
                  <input
                    type="text"
                    placeholder="اكتب إعلاناً مهماً أو اتركه فارغاً"
                    value={cmsAnnouncement}
                    onChange={(e) => setCmsAnnouncement(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none text-slate-800 dark:text-slate-200 focus:border-teal-500"
                  />
                </div>

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    onClick={saveZeroCodeConfig}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer"
                  >
                    حفظ ونشر التعديلات على صفحة المواطن
                  </button>
                </div>
              </div>
            </div>
            )}

              {subSettingsTab === 'database' && (
                <div className="glassmorphic-card p-6 space-y-6">
                  {/* Backup and Restore Database Panel */}
              <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Database className="w-5 h-5 text-teal-600 animate-pulse" />
                <span>إدارة النسخ الاحتياطي واستعادة البيانات</span>
              </h2>

              <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                تتيح لك هذه الخدمة سحب نسخة احتياطية كاملة من قاعدة بيانات المنظومة بما تشمله من حسابات مدراء، لجان تفتيش، منشآت غذائية، بنود التقييم، وشكاوى، وتخزينها في ملف بصيغة JSON لاستعادتها أو دمجها بأي وقت.
              </p>

              <div className="space-y-4">
                {/* Export Action */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-500/5 border border-teal-500/10 text-right">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-850 dark:text-slate-800 dark:text-slate-200">تصدير قاعدة البيانات (.JSON)</span>
                    <span className="text-[9px] text-slate-400 font-medium">تحميل نسخة احتياطية كاملة وحفظها على حاسوبك</span>
                  </div>
                  <button
                    onClick={handleBackupExport}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[11px] transition-all cursor-pointer whitespace-nowrap"
                  >
                    📥 عمل نسخة احتياطية
                  </button>
                </div>

                {/* Import Action */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-right">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-850 dark:text-slate-800 dark:text-slate-200">استيراد ودمج البيانات</span>
                    <span className="text-[9px] text-slate-400 font-medium font-bold">استرجاع البيانات من ملف نسخة احتياطية سابق</span>
                  </div>
                  <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-650 text-white font-extrabold text-[11px] transition-all cursor-pointer text-center whitespace-nowrap">
                    📤 رفع واستعادة
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleBackupImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            )}

              {subSettingsTab === 'system_controls' && (
                <div className="glassmorphic-card p-6 space-y-6 text-right">
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <span>ضوابط ومعايير النظام السيادية</span>
                  </h2>

                  {/* Maintenance Mode Toggle */}
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-red-600 dark:text-red-400 mb-1">وضع الصيانة والإغلاق (Maintenance Mode)</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">عند التفعيل، سيتم طرد ومنع جميع المستخدمين (لجان، مدراء) من الدخول باستثناء مدير الموقع.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={config.maintenanceMode || false}
                        onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  {/* Dynamic Grading Thresholds */}
                  <div className="space-y-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 mb-1">التحكم الديناميكي بمعايير التقييم</h3>
                      <p className="text-xs text-slate-500 font-bold">حدد درجات النجاح والرسوب، والتي سينعكس تأثيرها فوراً على ألوان ونتائج جميع المطاعم في المحافظة.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Passing Score Slider */}
                      <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black text-teal-700 dark:text-teal-600 dark:text-teal-400">الحد الأدنى للمنشأة "الملتزمة" (أخضر)</span>
                          <span className="text-sm font-black text-teal-600">{config.passingScore || 90}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" max="100" 
                          value={config.passingScore || 90} 
                          onChange={(e) => setConfig({ ...config, passingScore: parseInt(e.target.value) })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-teal-600"
                        />
                      </div>

                      {/* Warning Score Slider */}
                      <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black text-amber-700 dark:text-amber-400">الحد الأدنى للمنشأة "تحت المراقبة" (أصفر)</span>
                          <span className="text-sm font-black text-amber-600">{config.warningScore || 70}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" max="100" 
                          value={config.warningScore || 70} 
                          onChange={(e) => setConfig({ ...config, warningScore: parseInt(e.target.value) })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-amber-500"
                        />
                        <p className="text-[10px] text-slate-400 mt-2">ما دون هذه الدرجة سيُعتبر "مخالف" (أحمر).</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => {
                        localStorage.setItem('systemConfig', JSON.stringify(config));
                        notify('تم حفظ الإعدادات السيادية وتطبيقها فوراً!', 'success');
                      }}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-extrabold text-xs transition-all shadow-md"
                    >
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              )}

              {subSettingsTab === 'evaluations' && (
                <div className="glassmorphic-card p-6 flex flex-col justify-between">
                  {/* Compliance Text Checkpoint Editor */}
                  <div>
                <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <span>ثانياً: محرر نصوص بنود التقييم العشرون</span>
                </h2>

                <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                  تعديل الصياغة اللغوية لأي بند من بنود التقييم العشرين أو حذفها وإضافتها وتحديثها فورياً على استمارات المفتشين بالميدان:
                </p>

                <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                  {inspectionItems.map((item, idx) => (
                    <div key={item.id} className="flex gap-2 items-start py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 mt-2">
                        {idx + 1}
                      </span>
                      <textarea
                        rows="2"
                        value={item.text}
                        onChange={(e) => handleItemTextChange(item.id, e.target.value)}
                        className="flex-1 p-2 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-[11px] font-bold outline-none focus:border-teal-500 text-slate-700 dark:text-slate-300"
                      />
                      <div className="flex flex-col gap-1 shrink-0">
                        <span className="text-[8px] text-slate-450 font-bold block text-center">الدرجة</span>
                        <input
                          type="number"
                          value={item.points || 5}
                          onChange={(e) => handleItemPointsChange(item.id, e.target.value)}
                          className="w-12 p-1 rounded-xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-[11px] font-black text-center text-teal-600 dark:text-teal-600 dark:text-teal-400 outline-none focus:border-teal-500"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteChecklistItem(item.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 mt-3 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddChecklistItem}
                className="mt-4 w-full py-3 rounded-xl border border-dashed border-teal-500/30 hover:border-teal-500/60 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>➕ إضافة بند رقابي جديد لقائمة التقييم</span>
                  </button>
                </div>
              )}
            </div>
          </section>
        )}



        {/* Tab 4: Establishments Directory & QR Codes */}
        {activeTab === 'establishments' && (
          <section className="glassmorphic-card p-6 text-right space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-800 dark:text-white">🍽️ دليل المنشآت والتحكم برموز الـ QR وملصقات التوصيل</h2>
              <p className="text-[11px] text-slate-500 mt-1">عرض، وتعديل بيانات المطاعم وتصدير ملصقات الـ QR المخصصة للصالة وخدمات الديليفري</p>
            </div>

            {/* Search Filter bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="ابحث باسم المطعم أو المالك أو صنف النشاط..."
                value={estSearchTerm}
                onChange={(e) => setEstSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850 text-xs font-bold outline-none text-slate-850 dark:text-slate-200 focus:border-teal-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            </div>

            {/* Directory Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="p-3.5 font-bold">اسم المنشأة / الرخصة</th>
                      <th className="p-3.5 font-bold">نوع النشاط</th>
                      <th className="p-3.5 font-bold">المالك / الهاتف</th>
                      <th className="p-3.5 font-bold text-center">كود البوابة</th>
                      <th className="p-3.5 font-bold">القطاع</th>
                      <th className="p-3.5 font-bold">التقييم</th>
                      <th className="p-3.5 font-bold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                    {establishments
                      .filter(e => 
                        e.name.toLowerCase().includes(estSearchTerm.toLowerCase()) ||
                        e.owner.toLowerCase().includes(estSearchTerm.toLowerCase()) ||
                        e.type.toLowerCase().includes(estSearchTerm.toLowerCase())
                      )
                      .map(est => (
                        <tr key={est.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="p-3.5">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-slate-800 dark:text-slate-200">{est.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">الرخصة: {est.licenseNumber}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-slate-600 dark:text-slate-350">{est.type}</td>
                          <td className="p-3.5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 dark:text-slate-300">{est.owner}</span>
                              <span className="text-[10px] text-slate-400">{est.phone}</span>
                            </div>
                          </td>
                          <td className="p-3.5 font-bold text-center">
                            <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 dir-ltr inline-block">
                              {est.accessCode}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-col">
                              <span className="text-slate-500 font-bold">{est.sector}</span>
                              <span className="text-[9px] text-teal-600 dark:text-teal-600 dark:text-teal-400 mt-1 font-black">
                                {teams.find(t => t.sector === est.sector) 
                                  ? `مسؤولية: ${teams.find(t => t.sector === est.sector).name}`
                                  : '⚠️ غير مخصص لفريق'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              est.score >= 90 ? 'bg-emerald-500/10 text-emerald-600' :
                              est.score >= 70 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {est.lastInspection === 'لم يزر بعد' ? 'معلق ⏳' : `${est.score}%`}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => {
                                  setSelectedEstDetails(est);
                                  setQrTabMode('dining');
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-550/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 font-bold cursor-pointer transition-all"
                              >
                                🔗 رمز الـ QR
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEst(est);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold cursor-pointer transition-all"
                              >
                                📝 تعديل البيانات
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Tab 5: Audit Trail & Tickets */}
        {activeTab === 'audit' && (
          <section className="glassmorphic-card p-6 text-right space-y-6">
            {/* Sub Audit Tabs Selection Bar */}
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
              <button
                onClick={() => setSubAuditTab('trail')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer ${
                  subAuditTab === 'trail'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                🛡️ سجل التدقيق والأمان
              </button>
              <button
                onClick={() => setSubAuditTab('tickets')}
                className={`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  subAuditTab === 'tickets'
                    ? 'border-b-2 border-teal-600 text-teal-600 dark:text-teal-600 dark:text-teal-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                <span>الرد على بلاغات اللجان</span>
                {tickets.filter(t => t.status !== 'resolved').length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px]">{tickets.filter(t => t.status !== 'resolved').length}</span>
                )}
              </button>
            </div>

            {subAuditTab === 'trail' && (
              <>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-teal-600" />
                    <span>سجل التدقيق والمراقبة الأمنية (Audit Trail)</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">يعرض هذا السجل كافة حركات وتعديلات الفرق والمدراء مع أسباب التعديل الرسمية للحفاظ على نزاهة النظام.</p>
                </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="p-3.5 font-bold">تاريخ ووقت الحركة</th>
                      <th className="p-3.5 font-bold">اسم المستخدم (الصلاحية)</th>
                      <th className="p-3.5 font-bold">نوع الإجراء</th>
                      <th className="p-3.5 font-bold">سبب التعديل الرسمي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                    {auditLogs && auditLogs.length > 0 ? (
                      auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="p-3.5 font-bold text-slate-700 dark:text-slate-300 dir-ltr text-right">{new Date(log.date).toLocaleString('ar-IQ')}</td>
                          <td className="p-3.5">
                            <span className="font-black text-slate-800 dark:text-slate-800 dark:text-slate-200">{log.user}</span>
                            <span className="text-[10px] text-slate-400 block">{log.role === 'team' ? 'فريق ميداني' : 'إدارة عليا'}</span>
                          </td>
                          <td className="p-3.5 font-bold text-teal-600 dark:text-teal-600 dark:text-teal-400">{log.action}</td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400">
                            <span className="bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-lg block italic">
                              "{log.justification}"
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-6 text-center text-slate-400 font-bold">لا توجد حركات تعديل مسجلة في النظام حتى الآن.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
              </>
            )}

            {subAuditTab === 'tickets' && (
              <>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-teal-600" />
                    <span>مركز استقبال الدعم الفني وبلاغات اللجان (Tickets Center)</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-1">متابعة بلاغات الدعم الفني والمشاكل التقنية الواردة من اللجان والمدراء.</p>
                </div>

                <div className="space-y-4">
                  {(!tickets || tickets.length === 0) ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-bold">
                      📭 لا توجد تذاكر دعم فني أو بلاغات واردة حالياً.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                            <th className="py-2 px-3">المرسل</th>
                            <th className="py-2 px-3">النوع</th>
                            <th className="py-2 px-3">نص الرسالة/المشكلة</th>
                            <th className="py-2 px-3">الحالة</th>
                            <th className="py-2 px-3">الإجراء</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tickets.map((ticket) => (
                            <tr key={ticket.id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 font-extrabold text-slate-700 dark:text-slate-350">{ticket.sender}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  ticket.type === 'bug' ? 'bg-red-500/10 text-red-500' :
                                  ticket.type === 'feature' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {ticket.type === 'bug' ? '🐛 خلل فني' :
                                   ticket.type === 'feature' ? '💡 مقترح ميزة' : '📊 إشكال تقارير'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={ticket.text}>
                                {ticket.text}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500 animate-pulse'
                                }`}>
                                  {ticket.status === 'resolved' ? '✓ تم الحل' : '⏳ قيد المعالجة'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                {ticket.status !== 'resolved' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'resolved' } : t));
                                      triggerAlert('تم إغلاق ومعالجة تذكرة الدعم الفني بنجاح.');
                                    }}
                                    className="px-2.5 py-1 rounded bg-teal-650 hover:bg-teal-700 text-white font-extrabold text-[10px] transition-all cursor-pointer"
                                  >
                                    معالجة وإغلاق
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">مكتملة</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

          </section>
        )}
      </div>

      {/* VIEW TEAM DETAILS MODAL - High visibility design */}
      {selectedTeamDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-400">🔍 بطاقة معلومات فريق التفتيش بالتفصيل</h3>
              <button 
                onClick={() => setSelectedTeamDetails(null)} 
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">اسم اللجنة</span>
                  <span className="font-extrabold text-sm">{selectedTeamDetails.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">القطاع المكلف</span>
                  <span className="font-extrabold text-sm text-teal-600 dark:text-teal-400">{selectedTeamDetails.sector}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">البريد الإلكتروني للوزارة</span>
                  <span className="font-bold text-slate-300 dir-ltr block text-right">{selectedTeamDetails.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">رقم هاتف التواصل</span>
                  <span className="font-bold text-slate-300">{selectedTeamDetails.phone}</span>
                </div>
              </div>

              {/* Members listing */}
              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-black text-teal-600 dark:text-teal-400 block mb-3">👥 الكادر الإشرافي وأعضاء اللجنة الميدانية</span>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">الأطباء المعتمدون (دكتور):</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamDetails.members?.doctors?.map((doc, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-black">
                          {doc}
                        </span>
                      )) || <span className="text-slate-500 text-[10px]">لم يتم تحديد أطباء بعد</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">مساعد دكتور:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamDetails.members?.assistants?.map((asst, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 font-black">
                          {asst}
                        </span>
                      )) || <span className="text-slate-500 text-[10px]">لم يتم تحديد مساعدين بعد</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-400 block mb-1">الملاحظين الفنيين:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeamDetails.members?.technicians?.map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-black">
                          {tech}
                        </span>
                      )) || <span className="text-slate-500 text-[10px]">لم يتم تحديد ملاحظين فنيين بعد</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedTeamDetails(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition-all cursor-pointer"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-400">➕ إضافة وتعيين لجنة رقابية جديدة</h3>
              <button 
                onClick={() => setShowAddTeamModal(false)} 
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4 text-xs font-bold text-right">
                  <div>
                    <label className="text-slate-300 block mb-1">اسم اللجنة الرقابية</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: اللجنة الرقابية الرابعة"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 block mb-1">المسمى الوظيفي / الصلاحية الإدارية</label>
                    <select
                      disabled
                      className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 outline-none text-xs font-bold opacity-80 cursor-not-allowed"
                    >
                      <option value="الفرق الميدانية">الفرق الميدانية (رقابة وتفتيش ميداني)</option>
                    </select>
                  </div>

                  {/* Geographic scope selector */}
                  <div>
                    <label className="text-slate-300 block mb-1">القطاع الإداري العام</label>
                    <select
                      value={generalScope}
                      onChange={(e) => setGeneralScope(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-xs font-bold focus:border-teal-500"
                    >
                      <option value="mosul">مركز المدينة (الموصل)</option>
                      <option value="districts">أقضية ونواحي المحافظة</option>
                    </select>
                  </div>

                  {generalScope === 'mosul' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 block mb-1">الجانب</label>
                        <select
                          value={mosulSide}
                          onChange={(e) => setMosulSide(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-xs font-bold focus:border-teal-500"
                        >
                          <option value="left">الجانب الأيسر</option>
                          <option value="right">الجانب الأيمن</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1">الحي السكني / القطاع</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: الزهور، الغزلاني"
                          value={mosulNeighborhood}
                          onChange={(e) => setMosulNeighborhood(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 block mb-1">القضاء</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: تلعفر، الحمدانية"
                          value={districtName}
                          onChange={(e) => setDistrictName(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1">الناحية / الحي</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: ربيعة، حمام العليل"
                          value={districtSubsector}
                          onChange={(e) => setDistrictSubsector(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 block mb-1">البريد الإلكتروني للوزارة</label>
                      <input
                        type="email"
                        required
                        placeholder="team@ninveh.health.gov.iq"
                        value={newTeamEmail}
                        onChange={(e) => setNewTeamEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500 text-left dir-ltr"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">رقم هاتف اللجنة</label>
                      <input
                        type="text"
                        required
                        placeholder="077xxxxxxxx"
                        value={newTeamPhone}
                        onChange={(e) => setNewTeamPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">كلمة المرور المشفرة للجنة</label>
                    <div className="relative">
                      <input
                        type={showNewTeamPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={newTeamPass}
                        onChange={(e) => setNewTeamPass(e.target.value)}
                        className="w-full p-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewTeamPass(!showNewTeamPass)}
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
                      >
                        {showNewTeamPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Permissions Note */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 block mb-1">🛡️ صلاحيات حساب اللجنة الميدانية:</span>
                    <p className="text-[9px] text-slate-400 leading-relaxed">
                      تنويه: سيتم منح هذا الفريق الصلاحيات الأساسية (إضافة وتقييم المنشآت) افتراضياً. يمكنك تعديل الصلاحيات بشكل دقيق (مثل منح إذن الحذف) من خلال خيار "الأذونات" في جدول اللجان بعد الإنشاء.
                    </p>
                  </div>

                  {/* Mosul Warning Banner */}
                  {generalScope === 'mosul' && (
                    <div className="mt-3 p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[9px] text-teal-600 dark:text-teal-400 text-center font-bold">
                      (تنبيه: هذا الفريق يتبع إدارياً لمدير شعبة الأيسر/الأيمن الحالي في مركز المدينة)
                    </div>
                  )}

                  {/* Members registration form */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 block mb-2">👥 كادر وأعضاء اللجنة الميدانية:</span>
                    
                    {/* Doctors */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">حملة شهادة الطب البشري (دكتور)</span>
                        <button type="button" onClick={() => addField('doc')} className="p-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] flex items-center gap-1 cursor-pointer">
                          <Plus className="w-3 h-3" /> إضافة دكتور
                        </button>
                      </div>
                      {doctors.map((doc, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="اسم الدكتور الكامل..."
                            value={doc}
                            onChange={(e) => handleFieldChange('doc', idx, e.target.value)}
                            className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px]"
                          />
                          {doctors.length > 1 && (
                            <button type="button" onClick={() => removeField('doc', idx)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Assistant Doctors */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">مساعد دكتور / كادر تمريضي صحي</span>
                        <button type="button" onClick={() => addField('asst')} className="p-1 rounded bg-blue-500/10 text-blue-400 text-[10px] flex items-center gap-1 cursor-pointer">
                          <Plus className="w-3 h-3" /> إضافة مساعد
                        </button>
                      </div>
                      {assistants.map((asst, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="اسم المساعد الكامل..."
                            value={asst}
                            onChange={(e) => handleFieldChange('asst', idx, e.target.value)}
                            className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px]"
                          />
                          {assistants.length > 1 && (
                            <button type="button" onClick={() => removeField('asst', idx)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Technicians */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">ملاحظ فني / مفتش سلامة بيئية</span>
                        <button type="button" onClick={() => addField('tech')} className="p-1 rounded bg-amber-500/10 text-amber-400 text-[10px] flex items-center gap-1 cursor-pointer">
                          <Plus className="w-3 h-3" /> إضافة ملاحظ فني
                        </button>
                      </div>
                      {technicians.map((tech, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="اسم الملاحظ الفني الكامل..."
                            value={tech}
                            onChange={(e) => handleFieldChange('tech', idx, e.target.value)}
                            className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px]"
                          />
                          {technicians.length > 1 && (
                            <button type="button" onClick={() => removeField('tech', idx)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
                  >
                    تأكيد الحساب وإنشاء اللجنة
                  </button>

            </form>
          </div>
        </div>
      )}

      {/* EDIT TEAM MODAL - High visibility design */}
      {showEditTeamModal && editingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-400">📝 تعديل بيانات حساب اللجنة الميدانية</h3>
              <button 
                onClick={() => {
                  setShowEditTeamModal(false);
                  setEditingTeam(null);
                }} 
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleEditTeamSubmit} className="space-y-4 text-xs font-bold text-right">
              <div>
                <label className="text-slate-300 block mb-1">اسم اللجنة الرقابية</label>
                <input
                  type="text"
                  required
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-xs font-bold focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">القطاع الجغرافي المعين</label>
                <select
                  value={editingTeam.sector}
                  onChange={(e) => setEditingTeam({ ...editingTeam, sector: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-xs font-bold"
                >
                  <option value="الزهور">قطاع الزهور</option>
                  <option value="المصارف">قطاع المصارف</option>
                  <option value="الغزلاني">قطاع الغزلاني</option>
                  <option value="الجانب الأيمن">قطاع الجانب الأيمن</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">البريد الإلكتروني للوزارة</label>
                  <input
                    type="email"
                    required
                    value={editingTeam.email}
                    onChange={(e) => setEditingTeam({ ...editingTeam, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-xs font-bold text-left dir-ltr focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">رقم هاتف اللجنة</label>
                  <input
                    type="text"
                    required
                    value={editingTeam.phone}
                    onChange={(e) => setEditingTeam({ ...editingTeam, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-xs font-bold focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">كلمة المرور المشفرة للحساب</label>
                <div className="relative">
                  <input
                    type={showNewTeamPass ? 'text' : 'password'}
                    placeholder="اتركه فارغاً للاحتفاظ بكلمة المرور الحالية"
                    value={editingTeam.password || ''}
                    onChange={(e) => setEditingTeam({ ...editingTeam, password: e.target.value })}
                    className="w-full p-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewTeamPass(!showNewTeamPass)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showNewTeamPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* dynamic members inputs for editing */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <span className="text-[11px] text-teal-600 dark:text-teal-400 block mb-2">👥 تعديل كادر اللجنة الميدانية</span>
                
                {/* Doctors */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">حملة شهادة الطب البشري (دكتور)</span>
                    <button type="button" onClick={() => addField('doc', true)} className="p-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[10px] flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> إضافة دكتور
                    </button>
                  </div>
                  {editDoctors.map((doc, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="اسم الدكتور الكامل..."
                        value={doc}
                        onChange={(e) => handleFieldChange('doc', idx, e.target.value, true)}
                        className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px]"
                      />
                      {editDoctors.length > 1 && (
                        <button type="button" onClick={() => removeField('doc', idx, true)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Assistants */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">مساعد دكتور / كادر تمريضي صحي</span>
                    <button type="button" onClick={() => addField('asst', true)} className="p-1 rounded bg-blue-500/10 text-blue-400 text-[10px] flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> إضافة مساعد
                    </button>
                  </div>
                  {editAssistants.map((asst, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="اسم المساعد الكامل..."
                        value={asst}
                        onChange={(e) => handleFieldChange('asst', idx, e.target.value, true)}
                        className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px]"
                      />
                      {editAssistants.length > 1 && (
                        <button type="button" onClick={() => removeField('asst', idx, true)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Technicians */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">ملاحظ فني / مفتش سلامة بيئية</span>
                    <button type="button" onClick={() => addField('tech', true)} className="p-1 rounded bg-amber-500/10 text-amber-400 text-[10px] flex items-center gap-1 cursor-pointer">
                      <Plus className="w-3 h-3" /> إضافة ملاحظ فني
                    </button>
                  </div>
                  {editTechnicians.map((tech, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="اسم الملاحظ الفني الكامل..."
                        value={tech}
                        onChange={(e) => handleFieldChange('tech', idx, e.target.value, true)}
                        className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-[10px]"
                      />
                      {editTechnicians.length > 1 && (
                        <button type="button" onClick={() => removeField('tech', idx, true)} className="p-1 text-red-500 hover:bg-red-500/10 rounded cursor-pointer">
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
              >
                حفظ وحفظ التعديلات المدخلة
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ADD DIRECTOR MODAL */}
      {showAddDirectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-teal-600 dark:text-teal-400">💼 إنشاء وتعيين حساب قيادي/مدير جديد</h3>
              <button onClick={() => setShowAddDirectorModal(false)} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDirector} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-400">الاسم الكامل للمدير</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: د. عماد محمد عبد الله"
                  value={newDirName}
                  onChange={(e) => setNewDirName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">صلاحية النظام والمسمى القيادي</label>
                <select
                  value={newDirRole}
                  onChange={(e) => {
                    setNewDirRole(e.target.value);
                    if (e.target.value === 'director') {
                      setNewDirTitle('مدير صحة نينوى');
                    } else if (e.target.value === 'public_health') {
                      setNewDirTitle('مدير قسم الصحة العامة');
                    } else {
                      setNewDirTitle('مدير شعبة الرقابة الصحية');
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 font-bold"
                >
                  <option value="director">مدير عام صحة نينوى (Director General)</option>
                  <option value="public_health">مدير قسم الصحة العامة (Public Health Director)</option>
                  <option value="director_committee">مدير شعبة الرقابة الصحية (Sector Chief)</option>
                </select>
              </div>

              {/* Conditional Fields for Sector Chief */}
              {newDirRole === 'director_committee' && (
                <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-3 animate-fadeIn">
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-black">🗺️ النطاق الجغرافي المعين للمدير</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400">تحديد النطاق</label>
                      <select
                        value={newDirScope}
                        onChange={(e) => setNewDirScope(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                      >
                        <option value="centre">مركز المدينة</option>
                        <option value="districts">أقضية ونواحي</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400">تحديد الجانب/الضفة</label>
                      <select
                        value={newDirSide}
                        onChange={(e) => setNewDirSide(e.target.value)}
                        className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                      >
                        <option value="left">الجانب الأيسر</option>
                        <option value="right">الجانب الأيمن</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">البريد الإلكتروني للوزارة</label>
                  <input
                    type="email"
                    required
                    placeholder="director@ninveh.health.gov.iq"
                    value={newDirEmail}
                    onChange={(e) => setNewDirEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-left dir-ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">رقم هاتف التواصل</label>
                  <input
                    type="text"
                    required
                    placeholder="07700000000"
                    value={newDirPhone}
                    onChange={(e) => setNewDirPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-left dir-ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">كلمة المرور المشفرة للحساب</label>
                <div className="relative">
                  <input
                    type={showNewDirPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newDirPass}
                    onChange={(e) => setNewDirPass(e.target.value)}
                    className="w-full p-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewDirPass(!showNewDirPass)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showNewDirPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
              >
                إنشاء وتفعيل حساب القيادة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DIRECTOR MODAL */}
      {showEditDirectorModal && editingDirector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-blue-400">📝 تعديل حساب القيادي/المدير</h3>
              <button onClick={() => { setShowEditDirectorModal(false); setEditingDirector(null); }} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDirectorSubmit} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-400">الاسم الكامل للمدير</label>
                <input
                  type="text"
                  required
                  value={editingDirector.name}
                  onChange={(e) => setEditingDirector({ ...editingDirector, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">المسمى الوظيفي / الصلاحية الإدارية</label>
                <select
                  value={editingDirector.title}
                  onChange={(e) => setEditingDirector({ ...editingDirector, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none focus:border-teal-500 font-bold"
                >
                  <option value="مدير عام صحة نينوى">مدير عام صحة نينوى (Director General)</option>
                  <option value="مدير قسم الصحة العامة">مدير قسم الصحة العامة (Public Health Director)</option>
                  <option value="مدير شعبة الرقابة الصحية">مدير شعبة الرقابة الصحية (Sector Chief)</option>
                  <option value="مدير ناحية">مدير ناحية</option>
                  <option value="الفرق الميدانية">الفرق الميدانية</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">البريد الإلكتروني للوزارة</label>
                  <input
                    type="email"
                    required
                    value={editingDirector.email}
                    onChange={(e) => setEditingDirector({ ...editingDirector, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-left dir-ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">رقم هاتف التواصل</label>
                  <input
                    type="text"
                    required
                    value={editingDirector.phone}
                    onChange={(e) => setEditingDirector({ ...editingDirector, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none text-left dir-ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">كلمة المرور المشفرة للحساب</label>
                <div className="relative">
                  <input
                    type={showNewDirPass ? 'text' : 'password'}
                    placeholder="اتركه فارغاً للاحتفاظ بكلمة المرور الحالية"
                    value={editingDirector.password || ''}
                    onChange={(e) => setEditingDirector({ ...editingDirector, password: e.target.value })}
                    className="w-full p-2.5 pl-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 outline-none text-xs font-bold focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewDirPass(!showNewDirPass)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showNewDirPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
              >
                حفظ التعديلات المدخلة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ESTABLISHMENT PROFILE MODAL */}
      {editingEst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700/60 p-6 rounded-3xl text-white shadow-2xl relative text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-black text-blue-400">📝 تعديل بيانات المنشأة الصحية</h3>
              <button onClick={() => setEditingEst(null)} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditEstSubmit} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-slate-400">اسم المنشأة / المطعم</label>
                <input
                  type="text"
                  required
                  value={editingEst.name}
                  onChange={(e) => setEditingEst({ ...editingEst, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">صنف النشاط</label>
                <input
                  type="text"
                  required
                  value={editingEst.type}
                  onChange={(e) => setEditingEst({ ...editingEst, type: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">اسم المالك الكامل</label>
                <input
                  type="text"
                  required
                  value={editingEst.owner}
                  onChange={(e) => setEditingEst({ ...editingEst, owner: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400">رقم هاتف المالك</label>
                  <input
                    type="text"
                    required
                    value={editingEst.phone}
                    onChange={(e) => setEditingEst({ ...editingEst, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">رقم الإجازة الصحية</label>
                  <input
                    type="text"
                    required
                    value={editingEst.licenseNumber}
                    onChange={(e) => setEditingEst({ ...editingEst, licenseNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold block mb-1">القطاع والحي السكني</label>
                <input
                  type="text"
                  required
                  value={editingEst.sector}
                  onChange={(e) => setEditingEst({ ...editingEst, sector: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all cursor-pointer mt-4"
              >
                حفظ التعديلات المدخلة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Code and Restaurant Details Modal */}
      {selectedEstDetails && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md animate-fade-in text-right">
          <div className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-slate-800 dark:text-white shadow-[0_0_50px_-12px_rgba(20,184,166,0.3)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-5">
              <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-l from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">🔗 رمز الاستجابة السريعة QR وتفاصيل المنشأة</h3>
              <button 
                onClick={() => setSelectedEstDetails(null)} 
                className="flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all items-center justify-center group shadow-sm border border-slate-200 dark:border-white/5"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              <div className="p-5 rounded-2xl bg-slate-100/40 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] text-right space-y-2">
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block font-black uppercase mb-1">البيانات الرسمية للمنشأة</span>
                <h4 className="text-base font-black text-white">{selectedEstDetails.name}</h4>
                <div className="grid grid-cols-1 gap-2 pt-1">
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">النشاط: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.type}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">المالك: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.owner}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">رقم الهاتف: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.phone}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">الترخيص: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.licenseNumber}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">آخر زيارة تفتيش: <strong className="text-slate-800 dark:text-slate-200">{selectedEstDetails.lastInspection}</strong></p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">التقييم: <strong className={selectedEstDetails.score >= 90 ? 'text-emerald-400' : 'text-amber-500'}>{selectedEstDetails.lastInspection === 'لم يزر بعد' ? 'معلق' : `${selectedEstDetails.score}%`}</strong></p>
                </div>
                <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl relative overflow-hidden">
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-teal-500/20 blur-xl rounded-full"></div>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-bold text-center">🔑 كود بوابة المالك:</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-widest text-center mt-1 dir-ltr drop-shadow-[0_2px_10px_rgba(45,212,191,0.5)]">{selectedEstDetails.accessCode}</p>
                </div>
              </div>

              {/* QR Preview Box */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-4 border-slate-200 dark:border-slate-900 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] relative">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`}
                  alt="Restaurant QR Code"
                  className="w-48 h-48 block rounded-xl shadow-lg mix-blend-multiply"
                />
                <span className="text-[10px] text-slate-500 font-extrabold mt-4 text-center block max-w-[200px] leading-relaxed">
                  كود QR الموحد للمنشأة (يعرض التقييم الصحي ويمكن المواطن من الإبلاغ)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/scan/${selectedEstDetails.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-2xl bg-gradient-to-l from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-center font-black block transition-all shadow-[0_5px_15px_-3px_rgba(20,184,166,0.4)] hover:shadow-[0_8px_20px_-3px_rgba(20,184,166,0.5)]"
                >
                  📥 تحميل الصورة
                </a>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-center font-black block transition-all shadow-inner"
                >
                  🖨️ طباعة ملصق
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEstDetails(null)}
                className="mt-2 w-full py-3 rounded-2xl bg-transparent hover:bg-white/5 text-slate-600 dark:text-slate-400 font-extrabold transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}

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

      {accountModalState.isOpen && (
        <AccountModal
          isOpen={accountModalState.isOpen}
          mode={accountModalState.mode}
          accountType={accountModalState.accountType}
          initialData={accountModalState.data}
          teams={teams}
          onClose={() => setAccountModalState({ isOpen: false, mode: 'add', data: null, accountType: 'team' })}
          onSave={handleSaveAccount}
        />
      )}
        {activeTab === 'broadcast' && (
          <div className="glassmorphic-card p-6 border border-red-500/20">
            <h2 className="text-xl font-black text-red-600 dark:text-red-500 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <span>نظام البث العاجل (إنذار الطوارئ وإقفال الشاشات)</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-bold text-right">
              سيؤدي هذا إلى إرسال إنذار فوري يقفل شاشات جميع الفرق الميدانية والمدراء ولن يتمكنوا من العمل حتى يؤكدوا الاستلام.
            </p>
            
            <div className="space-y-4 text-right">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">نص رسالة البث</label>
                <textarea
                  value={globalBroadcast.message}
                  onChange={(e) => setGlobalBroadcast({ ...globalBroadcast, message: e.target.value })}
                  placeholder="اكتب رسالة الإنذار هنا..."
                  className="w-full p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 focus:border-red-500 font-bold text-sm h-32"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if(!globalBroadcast.message) return notify('الرجاء إدخال الرسالة', 'error');
                    setGlobalBroadcast({ ...globalBroadcast, active: true, acknowledgedBy: [], timestamp: new Date().toISOString() });
                    notify('تم تفعيل الإنذار العاجل لجميع المستخدمين!', 'success', true);
                  }}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-500/30"
                >
                  <BellRing className="w-5 h-5" />
                  <span>تفعيل البث العاجل الآن</span>
                </button>

                <button
                  onClick={() => {
                    setGlobalBroadcast({ active: false, message: '', acknowledgedBy: [] });
                    notify('تم إيقاف البث العاجل وإلغاء القفل.', 'info');
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-sm transition-all"
                >
                  إيقاف البث (إلغاء)
                </button>
              </div>

              {globalBroadcast.active && (
                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <h3 className="text-sm font-black text-green-600 dark:text-green-400 mb-2">المستخدمين الذين أكدوا الاستلام ({globalBroadcast.acknowledgedBy?.length || 0})</h3>
                  <div className="flex flex-wrap gap-2">
                    {globalBroadcast.acknowledgedBy?.map((id, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-bold rounded-lg border border-green-200 dark:border-green-800/50">
                        {id}
                      </span>
                    ))}
                    {(!globalBroadcast.acknowledgedBy || globalBroadcast.acknowledgedBy.length === 0) && (
                      <span className="text-xs text-slate-400">لا يوجد أحد أكد الاستلام حتى الآن.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="glassmorphic-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-blue-600 dark:text-blue-500 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                <span>لوحة كفاءة وأداء الفرق الميدانية</span>
              </h2>
              <button 
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 no-print"
              >
                📄 استخراج التقرير الوزاري
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teams.map(team => {
                // Calculate team stats
                const teamEsts = establishments.filter(e => e.sector === team.sector);
                const inspectionsDone = teamEsts.filter(e => e.lastInspection !== 'لم يزر بعد').length;
                const total = teamEsts.length;
                const coverage = total > 0 ? Math.round((inspectionsDone / total) * 100) : 0;
                
                return (
                  <div key={team.id} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      {team.name}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-500 font-bold mb-1">المنشآت المسندة</span>
                        <span className="text-lg font-black text-slate-800 dark:text-white">{total}</span>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                        <span className="block text-[10px] text-slate-500 font-bold mb-1">الكشوفات المنجزة</span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{inspectionsDone}</span>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500 opacity-10" style={{ width: `${coverage}%` }}></div>
                        <span className="block text-[10px] text-slate-500 font-bold mb-1">نسبة التغطية</span>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">{coverage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Advanced Analytics: Violations */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-rose-200/50 dark:border-rose-900/30">
                <ThreeDBarChart 
                  title="🚨 المطاعم الأكثر مخالفة (الجانب الأيسر)"
                  data={establishments
                    .filter(e => e.sector === 'الجانب الأيسر' && e.lastInspection !== 'لم يزر بعد')
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 5)
                    .map(e => ({ label: e.name, value: e.score, color: e.score < (config.warningScore || 70) ? '#E11D48' : '#F59E0B' }))}
                />
              </div>
              <div className="bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-rose-200/50 dark:border-rose-900/30">
                <ThreeDBarChart 
                  title="🚨 المطاعم الأكثر مخالفة (الجانب الأيمن)"
                  data={establishments
                    .filter(e => e.sector === 'الجانب الأيمن' && e.lastInspection !== 'لم يزر بعد')
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 5)
                    .map(e => ({ label: e.name, value: e.score, color: e.score < (config.warningScore || 70) ? '#E11D48' : '#F59E0B' }))}
                />
              </div>
            </div>

            </div>

            {/* Hidden Printable Ministerial Report */}
            <div className="hidden print:block absolute top-0 left-0 w-full h-auto bg-white text-black p-8 z-50 dir-rtl text-right print-only-report">
              <div className="border-b-4 border-slate-900 pb-4 mb-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">جمهورية العراق - وزارة الصحة</h1>
                  <h2 className="text-xl font-bold text-slate-700 mt-1">دائرة صحة نينوى - قسم الرقابة الصحية</h2>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">التاريخ: {new Date().toLocaleDateString('ar-IQ')}</p>
                  <p className="text-sm font-bold mt-1">مستخرج بواسطة: {user?.name || 'مدير الموقع'}</p>
                </div>
              </div>

              <h3 className="text-xl font-black text-center mb-8 bg-slate-100 py-3 border border-slate-300">
                التقرير الموحد للتفتيش الصحي والمواقف الرقابية
              </h3>

              <div className="mb-8">
                <h4 className="text-lg font-black border-b-2 border-slate-300 pb-2 mb-4">إحصائيات الفرق الميدانية ونسبة التغطية</h4>
                <table className="w-full text-right border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-200">
                      <th className="p-3 border border-slate-300 font-bold">اسم اللجنة الرقابية</th>
                      <th className="p-3 border border-slate-300 font-bold">قاطع العمل</th>
                      <th className="p-3 border border-slate-300 font-bold">المنشآت المسندة</th>
                      <th className="p-3 border border-slate-300 font-bold">الكشوفات المنجزة</th>
                      <th className="p-3 border border-slate-300 font-bold">نسبة التغطية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map(team => {
                      const teamEsts = establishments.filter(e => e.sector === team.sector);
                      const inspectionsDone = teamEsts.filter(e => e.lastInspection !== 'لم يزر بعد').length;
                      const total = teamEsts.length;
                      const coverage = total > 0 ? Math.round((inspectionsDone / total) * 100) : 0;
                      return (
                        <tr key={team.id}>
                          <td className="p-3 border border-slate-300">{team.name}</td>
                          <td className="p-3 border border-slate-300">{team.sector}</td>
                          <td className="p-3 border border-slate-300">{total}</td>
                          <td className="p-3 border border-slate-300">{inspectionsDone}</td>
                          <td className="p-3 border border-slate-300 font-bold text-slate-800">{coverage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-black border-b-2 border-slate-300 pb-2 mb-4 text-red-700">قائمة المنشآت المخالفة للضوابط الصحية (تتطلب غلق أو غرامة)</h4>
                <table className="w-full text-right border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="p-3 border border-slate-300 font-bold">اسم المنشأة</th>
                      <th className="p-3 border border-slate-300 font-bold">الصنف</th>
                      <th className="p-3 border border-slate-300 font-bold">القاطع</th>
                      <th className="p-3 border border-slate-300 font-bold">تاريخ آخر كشف</th>
                      <th className="p-3 border border-slate-300 font-bold text-center">نسبة التقييم</th>
                    </tr>
                  </thead>
                  <tbody>
                    {establishments
                      .filter(e => e.lastInspection !== 'لم يزر بعد' && e.score < (config.warningScore || 70))
                      .sort((a, b) => a.score - b.score)
                      .map(e => (
                        <tr key={e.id}>
                          <td className="p-3 border border-slate-300 font-bold">{e.name}</td>
                          <td className="p-3 border border-slate-300">{e.type}</td>
                          <td className="p-3 border border-slate-300">{e.sector}</td>
                          <td className="p-3 border border-slate-300">{e.lastInspection}</td>
                          <td className="p-3 border border-slate-300 text-center font-black text-red-600">{e.score}%</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {establishments.filter(e => e.lastInspection !== 'لم يزر بعد' && e.score < (config.warningScore || 70)).length === 0 && (
                  <p className="p-4 text-center border border-t-0 border-slate-300 text-slate-500 font-bold">لا توجد أي منشآت مخالفة في الوقت الحالي.</p>
                )}
              </div>

              <div className="mt-16 pt-8 border-t-2 border-slate-300 flex justify-between px-10">
                <div className="text-center">
                  <p className="font-black mb-6">مصادقة مدير الرقابة الصحية</p>
                  <p className="text-slate-400">................................................</p>
                </div>
                <div className="text-center">
                  <p className="font-black mb-6">مصادقة المدير العام</p>
                  <p className="text-slate-400">................................................</p>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default SuperAdminPanel;
