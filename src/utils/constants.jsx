import { Building, Compass, Activity, Mail, ShieldAlert, Bell, Settings, Target } from 'lucide-react';
import React from 'react';

export const ROLES_DICTIONARY = [
  { id: 'director_general', label: 'مدير عام دائرة صحة نينوى', category: 'الإدارة العليا' },
  { id: 'deputy_director_general', label: 'معاون المدير العام للشؤون الفنية', category: 'الإدارة العليا' },
  { id: 'public_health_director', label: 'مدير قسم الصحة العامة', category: 'الإدارة الوسطى' },
  { id: 'central_director', label: 'مدير الرقابة المركزية', category: 'الإدارة الوسطى' },
  { id: 'deputy_public_health_director', label: 'معاون مدير القسم', category: 'الإدارة الوسطى' },
  { id: 'central_health_sector_director', label: 'مدير شعبة الرقابة الصحية المركزية', category: 'الإدارة الوسطى' },
  { id: 'right_bank_sector_director', label: 'مدير شعبة الرقابة الصحية : مركز المحافظة - الجانب الأيمن', category: 'الإدارة الميدانية' },
  { id: 'left_bank_sector_director', label: 'مدير شعبة الرقابة الصحية : مركز المحافظة - الجانب الأيسر', category: 'الإدارة الميدانية' },
  { id: 'district_sector_director_talafar', label: 'مدير شعبة الرقابة الصحية في تلعفر', category: 'الإدارة الميدانية' },
  { id: 'district_sector_director_sinjar', label: 'مدير شعبة الرقابة الصحية في سنجار', category: 'الإدارة الميدانية' },
  { id: 'district_sector_director_hamdaniya', label: 'مدير شعبة الرقابة الصحية في الحمدانية', category: 'الإدارة الميدانية' },
  { id: 'field_team_leader', label: 'مسؤول الفريق الرقابي الميداني', category: 'الكوادر الفنية' },
  { id: 'field_team_member', label: 'عضو لجنة رقابية', category: 'الكوادر الفنية' },
  { id: 'specialized_health_inspector', label: 'مفتش صحي متخصص', category: 'الكوادر الفنية' },
  { id: 'food_quality_controller', label: 'مراقب جودة الأغذية', category: 'الكوادر الفنية' },
];

export const NINEVEH_GEOGRAPHY = {
  mosul: {
    label: 'قضاء الموصل (المركز)',
    sides: {
      right: {
        label: 'مركز المحافظة - الجانب الأيمن',
        neighborhoods: [
          'الموصل القديمة', 'باب البيض', 'باب الطوب', 'الميدان', 'رأس الكور', 'الشفاء', 
          'الفاروق', 'الدواسة', 'النبي شيت', 'الطيران', 'الجوسق', 'اليرموك', 'وادي حجر', 
          'مشيرفة', 'تموز', 'الإصلاح الزراعي', 'العريبي'
        ]
      },
      left: {
        label: 'مركز المحافظة - الجانب الأيسر',
        neighborhoods: [
          'المجموعة الثقافية', 'حي الزهور', 'المصارف', 'المثنى', 'البريد', 'المهندسين', 
          'الفلاح', 'النور', 'حي الشرطة', 'الكفاءات', 'الجامعة', 'حي العربي', 'حي الضباط', 
          'السكر', 'البلديات'
        ]
      }
    }
  },
  districts: [
    {
      id: 'hamdaniya',
      label: 'قضاء الحمدانية',
      subdistricts: ['بخديدا', 'برطلة', 'النمرود', 'كرمليس', 'طهراوه']
    },
    {
      id: 'talafar',
      label: 'قضاء تلعفر',
      subdistricts: ['المركز', 'العياضية', 'زمار', 'ربيعة']
    },
    {
      id: 'shikhan',
      label: 'قضاء الشيخان',
      subdistricts: ['المركز', 'بعشيقة']
    },
    {
      id: 'sinjar',
      label: 'قضاء سنجار',
      subdistricts: ['المركز', 'الشمال (سنوني)', 'القحطانية']
    },
    {
      id: 'makhmour',
      label: 'قضاء مخمور',
      subdistricts: ['المركز', 'الكوير', 'قراج']
    },
    {
      id: 'aqra',
      label: 'قضاء عقرة',
      subdistricts: ['المركز', 'بردرش']
    },
    {
      id: 'hadhar',
      label: 'قضاء الحضر',
      subdistricts: ['المركز']
    },
    {
      id: 'baaj',
      label: 'قضاء البعاج',
      subdistricts: ['المركز']
    }
  ]
};

export const DEFAULT_PERMISSIONS = {
  // Section A: Establishments
  manageEstablishments: false,
  createEst: false,
  editEst: false,
  deleteEst: false,
  addEval: false,
  // Section B: Pages
  showMainDashboard: false,
  showOperationsRoom: false,
  showReportsPage: false,
  showDirectivesPage: false,
  showPublicEvalsPage: false,
  showDeliveryPage: false,
  showLabPage: false,
  managePayments: false,
  // Section C: Directives
  sendDirective: false,
  replyDirective: false,
  quickTeamDispatch: false,
  // Section D: Penalties & Enforcement
  issueFine: false,
  closeEst: false,
  reopenEst: false,
  // Section E: Advanced Admin
  showSectorMap: false,
  showSmartTasks: false,
  showFieldTeamsStats: false,
  showTeamMonthlyStats: false,
  notify_closures: false,
  notify_inspections: false,
  notify_directives: false,
  exportData: false,
  viewAuditLogs: false,
  manageAccounts: false,
  manageSettings: false,
  backupData: false
};

export const PERMISSIONS_TABS = [
  { id: 'operations_room', label: 'غرفة العمليات المركزية', icon: <Target className="w-4 h-4 text-red-500"/>, keys: ['authenticatePenalties', 'showFieldTeamsStats'] },
  { id: 'establishments', label: 'المنشآت', icon: <Building className="w-4 h-4"/>, keys: ['createEst', 'addEval', 'editEst', 'deleteEst'] },
  { id: 'complaints', label: 'الشكاوى', icon: <Compass className="w-4 h-4 text-rose-500"/>, keys: ['showPublicEvalsPage', 'showDeliveryPage'] },
  { id: 'lab', label: 'المختبر', icon: <Activity className="w-4 h-4 text-teal-500"/>, keys: ['receiveSamples', 'enterLabResults', 'labArchive'] },
  { id: 'financials', label: 'المالية', icon: <Activity className="w-4 h-4 text-emerald-500"/>, keys: ['financialReports', 'payFines', 'dailyInventory'] },
  { id: 'directives', label: 'التبليغات', icon: <Mail className="w-4 h-4"/>, keys: ['showDirectivesPage', 'sendDirective', 'replyDirective', 'quickTeamDispatch'] },
  { id: 'penalties', label: 'العقوبات', icon: <ShieldAlert className="w-4 h-4 text-red-400"/>, keys: ['issueFine', 'closeEst', 'reopenEst'] },
  { id: 'notifications', label: 'الإشعارات', icon: <Bell className="w-4 h-4 text-amber-500"/>, keys: ['notify_closures', 'notify_inspections', 'notify_directives'] },
  { id: 'advanced', label: 'الإدارة المتقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['showMainDashboard', 'showReportsPage', 'exportData', 'backupData'] },
];

export const PERMISSION_DETAILS = {
  createEst: { title: 'إضافة منشأة جديدة', desc: 'هذا الإذن يتيح للحساب إمكانية تسجيل وإضافة منشآت جديدة إلى النظام.' },
  editEst: { title: 'تعديل بيانات المنشأة', desc: 'يتيح للحساب صلاحية الدخول لبيانات أي منشأة مسجلة وتحديث معلوماتها (كاسم المدير، رقم الهاتف، والتراخيص).' },
  deleteEst: { title: 'حذف منشأة نهائياً', desc: 'إذن خطير: يسمح لهذا الحساب بشطب ومسح المنشأة نهائياً من قاعدة بيانات النظام.' },
  addEval: { title: 'إضافة كشف صحي', desc: 'يتيح للحساب صلاحية إجراء جولات تفتيشية وتسجيل نقاط التقييم الصحية للمنشآت.' },
  showMainDashboard: { title: 'اللوحة الاستراتيجية', desc: 'الاطلاع على التقارير والإحصائيات الشاملة للمنظومة.' },
  showReportsPage: { title: 'الخريطة الجغرافية', desc: 'يسمح برؤية الخارطة التفاعلية وتوزيع المنشآت على أحياء وأقضية المحافظة.' },
  showDirectivesPage: { title: 'رؤية التبليغات والتوجيهات', desc: 'يسمح للحساب بفتح صفحة "التوجيهات" لمشاهدة المراسلات الإدارية الواردة والصادرة.' },
  showPublicEvalsPage: { title: 'شكاوى المواطنين', desc: 'يسمح برؤية ومتابعة شكاوى المواطنين التي تصل عبر البوابة العامة.' },
  showDeliveryPage: { title: 'شكاوى خدمة التوصيل', desc: 'يسمح بمتابعة البلاغات الواردة بخصوص شركات التوصيل والدراجات النارية.' },
  receiveSamples: { title: 'استلام العينات', desc: 'يسمح للمختبر باستلام وجدولة العينات المسحوبة من المنشآت.' },
  enterLabResults: { title: 'إدخال نتائج الفحص', desc: 'يسمح بإدخال وتوثيق نتائج الفحوصات المختبرية.' },
  labArchive: { title: 'أرشيف المختبر', desc: 'يسمح بالاطلاع على السجل التاريخي لكافة الفحوصات المختبرية السابقة.' },
  financialReports: { title: 'التقارير المالية', desc: 'يسمح للحساب بعرض التقارير المالية والإحصائيات الخاصة بالغرامات والواردات.' },
  payFines: { title: 'تسديد الغرامات', desc: 'يسمح للحساب بتوثيق دفع الغرامات ورفع الوصل المالي لتبرئة ذمة المنشأة.' },
  dailyInventory: { title: 'الجرد اليومي والمطابقة', desc: 'يسمح بإجراء الجرد اليومي والمطابقة المالية للإيرادات.' },
  sendDirective: { title: 'إرسال تبليغ جديد', desc: 'إذا تم تفعيله، سيتمكن الحساب من كتابة وإرسال أوامر إدارية أو تبليغات للفرق واللجان الميدانية.' },
  replyDirective: { title: 'الرد على التبليغات', desc: 'يسمح للحساب بالرد المباشر والتعليق على التبليغات الواردة من الإدارة.' },
  quickTeamDispatch: { title: 'التوجيه السريع للفرق الميدانية', desc: 'يسمح بإرسال مهام كشف صحي فورية وعاجلة للفرق الرقابية.' },
  showSectorMap: { title: 'خريطة القطاع', desc: 'يسمح للفريق برؤية خريطة المنشآت الواقعة ضمن قاطع عملهم الميداني حصراً.' },
  showSmartTasks: { title: 'مهام اليوم (المهام الذكية)', desc: 'يسمح للفريق بالوصول لجدول المهام اليومية المخصصة لهم.' },
  showFieldTeamsStats: { title: 'متابعة أداء الفرق', desc: 'يسمح برؤية تقييمات وأداء اللجان الميدانية.' },
  authenticatePenalties: { title: 'المصادقة على العقوبات', desc: 'يسمح بالاطلاع على طلبات الإغلاق والغرامات المرفوعة من الفرق والمصادقة عليها.' },
  issueFine: { title: 'إصدار غرامة مالية', desc: 'يمنح هذا الحساب صلاحية فرض غرامات وعقوبات مالية على المنشآت المخالفة وتوثيقها.' },
  closeEst: { title: 'إصدار أمر إغلاق (تشميع)', desc: 'إذن خطير: يعطي الحساب صلاحية اتخاذ قرار بإغلاق المنشأة فوراً ومنعها من العمل.' },
  reopenEst: { title: 'إعادة فتح المنشأة', desc: 'يسمح برفع حظر الإغلاق عن المنشأة وإعادتها لحالة العمل الطبيعية بعد إزالة المخالفة.' },
  notify_closures: { title: 'إشعارات الإغلاقات والعقوبات', desc: 'يسمح بوصول إشعارات المصادقة على الإغلاق أو إصدار الغرامات الميدانية.' },
  notify_inspections: { title: 'إشعارات الكشوفات والمهام', desc: 'يسمح بوصول إشعارات إضافة كشف جديد أو طلبات إعادة الكشف.' },
  notify_directives: { title: 'إشعارات التبليغات الإدارية', desc: 'يسمح بوصول إشعارات القرارات الإدارية واجتماعات المجلس.' },
  exportData: { title: 'تصدير التقارير', desc: 'يسمح بتنزيل بيانات المنظومة وجداول المنشآت على شكل ملفات Excel أو PDF لغرض الأرشفة.' },
  backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' },
  showTeamDashboard: { title: 'اللوحة الميدانية', desc: 'يسمح للحساب بالوصول إلى لوحة المتابعة الميدانية والعمليات اليومية.' },
  monitorClosures: { title: 'لوحة الرصد والمتابعة', desc: 'مراقبة التزام المنشآت بقرارات الإغلاق والتشميع.' },
  searchAndAddPreliminaryEst: { title: 'الاستعلام والرصد', desc: 'البحث عن المنشآت، وإضافة منشأة أولية/غير مسجلة مع تحديد موقعها وصورها ليتم تفتيشها لاحقاً.' }
};

export const ROLE_CORE_BASICS = {
  director: ['showMainDashboard'],
  central_director: ['authenticatePenalties', 'showFieldTeamsStats', 'editEst', 'deleteEst'],
  accountant: ['financialReports', 'payFines', 'dailyInventory'],
  financial_accountant: ['financialReports', 'payFines', 'dailyInventory'],
  team: ['showTeamDashboard', 'showSmartTasks', 'showSectorMap', 'createEst', 'addEval', 'manageEstablishments'],
  lab: ['receiveSamples', 'enterLabResults', 'labArchive'],
  tracker: ['monitorClosures', 'searchAndAddPreliminaryEst']
};

export const PERMISSION_ROLES = {
  // 'management' only permissions
  deleteEst: 'management',
  showMainDashboard: 'management',
  showOperationsRoom: 'management',
  showReportsPage: 'management',
  showPublicEvalsPage: 'management',
  sendDirective: 'management',
  quickTeamDispatch: 'management',
  showFieldTeamsStats: 'management',
  closeEst: 'management',
  reopenEst: 'management',
  exportData: 'management',
  viewAuditLogs: 'management',
  manageAccounts: 'management',
  manageSettings: 'management',
  backupData: 'management',
  manageComplaints: 'management',
  
  // 'team' only permissions
  addEval: 'team',
  replyDirective: 'team',
  showSectorMap: 'team',
  showSmartTasks: 'team',
  showTeamMonthlyStats: 'team',
  
  // 'all' by default for the rest, but we can explicitly list them or rely on the fallback
};
