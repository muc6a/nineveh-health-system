import { Building, Compass, Activity, Mail, ShieldAlert, Bell, Settings } from 'lucide-react';
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
  // Section D: Penalties & Enforcement
  issueFine: false,
  closeEst: false,
  reopenEst: false,
  // Section E: Advanced Admin
  canSendSOS: false,
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
  { id: 'establishments', label: 'إدارة المنشآت', icon: <Building className="w-4 h-4"/>, keys: ['manageEstablishments', 'createEst', 'editEst', 'deleteEst'] },
  { id: 'pages', label: 'صفحات النظام', icon: <Compass className="w-4 h-4"/>, keys: ['showMainDashboard', 'showOperationsRoom', 'showReportsPage', 'showPublicEvalsPage', 'showDeliveryPage', 'showLabPage', 'managePayments'] },
  { id: 'team_features', label: 'ميزات الفريق الميداني', icon: <Activity className="w-4 h-4"/>, keys: ['addEval', 'showSectorMap', 'showSmartTasks', 'canSendSOS', 'showFieldTeamsStats', 'showTeamMonthlyStats'] },
  { id: 'directives', label: 'التبليغات', icon: <Mail className="w-4 h-4"/>, keys: ['showDirectivesPage', 'sendDirective', 'replyDirective'] },
  { id: 'penalties', label: 'العقوبات والإغلاقات', icon: <ShieldAlert className="w-4 h-4 text-red-400"/>, keys: ['issueFine', 'closeEst', 'reopenEst'] },
  { id: 'notifications', label: 'الإشعارات المخصصة', icon: <Bell className="w-4 h-4 text-amber-500"/>, keys: ['notify_closures', 'notify_inspections', 'notify_directives'] },
  { id: 'advanced', label: 'إدارة متقدمة', icon: <Settings className="w-4 h-4"/>, keys: ['exportData', 'viewAuditLogs', 'manageAccounts', 'manageSettings', 'backupData'] },
];

export const PERMISSION_DETAILS = {
  manageEstablishments: { title: 'إدارة المنشآت (المفتاح الرئيسي)', desc: 'بإعطاء هذا الإذن، سيتمكن هذا الحساب من رؤية قسم المنشآت والمطاعم بالكامل والوصول إليه.' },
  createEst: { title: 'إضافة منشأة جديدة', desc: 'هذا الإذن يتيح للحساب إمكانية تسجيل وإضافة مطاعم أو كافيهات أو منشآت جديدة إلى النظام.' },
  editEst: { title: 'تعديل بيانات المنشأة', desc: 'يتيح للحساب صلاحية الدخول لبيانات أي مطعم مسجل وتحديث معلوماته (كاسم المدير، رقم الهاتف، والتراخيص).' },
  deleteEst: { title: 'حذف منشأة نهائياً', desc: 'إذن خطير: يسمح لهذا الحساب بشطب ومسح المنشأة نهائياً من قاعدة بيانات النظام.' },
  addEval: { title: 'إضافة كشف صحي', desc: 'يتيح للحساب صلاحية إجراء جولات تفتيشية وتسجيل نقاط التقييم الصحية للمطاعم.' },
  showMainDashboard: { title: 'اللوحة الرئيسية', desc: 'يسمح للحساب برؤية الواجهة الرئيسية (الاستراتيجية، الميدانية، الخ).' },
  showOperationsRoom: { title: 'غرفة العمليات المركزية', desc: 'يسمح برؤية شاشة غرفة العمليات والتحكم المركزي المباشر.' },
  showReportsPage: { title: 'الخريطة الجغرافية', desc: 'يسمح برؤية الخارطة التفاعلية وتوزيع المطاعم على أحياء وأقضية محافظة نينوى.' },
  showDirectivesPage: { title: 'التبليغات والتوجيهات', desc: 'يسمح للحساب بفتح صفحة "التوجيهات" لمشاهدة المراسلات الإدارية الواردة والصادرة.' },
  showPublicEvalsPage: { title: 'شكاوى المواطنين', desc: 'يسمح برؤية ومتابعة شكاوى المواطنين التي تصل عبر البوابة العامة.' },
  showDeliveryPage: { title: 'شكاوى خدمة التوصيل', desc: 'يسمح بمتابعة البلاغات الواردة بخصوص شركات التوصيل والدراجات النارية.' },
  showLabPage: { title: 'اللوحة المختبرية', desc: 'يسمح للحساب بإدارة النماذج والطلبات الواردة للمختبر.' },
  managePayments: { title: 'الإدارة المالية', desc: 'يسمح للحساب بمتابعة الجرد المالي وتسديد الغرامات.' },
  sendDirective: { title: 'إرسال تبليغ جديد', desc: 'إذا تم تفعيله، سيتمكن الحساب من كتابة وإرسال أوامر إدارية أو تبليغات للفرق واللجان الميدانية.' },
  replyDirective: { title: 'الرد على التبليغات', desc: 'يسمح للحساب بالرد المباشر والتعليق على التبليغات الواردة من الإدارة.' },
  canSendSOS: { title: 'إرسال نداء استغاثة (SOS)', desc: 'يسمح للفريق بإرسال إشعار طارئ لغرفة العمليات لطلب الإسناد.' },
  showSectorMap: { title: 'خريطة القطاع', desc: 'يسمح للفريق برؤية خريطة المنشآت الخاصة بقطاعهم الميداني.' },
  showSmartTasks: { title: 'مهام اليوم (المهام الذكية)', desc: 'يسمح للفريق بالوصول لجدول المهام اليومية المخصصة لهم.' },
  showFieldTeamsStats: { title: 'تقارير الفرق الميدانية', desc: 'يسمح برؤية إحصائيات وأداء اللجان الميدانية بشكل فردي.' },
  showTeamMonthlyStats: { title: 'إحصائيات الإغلاقات والغرامات', desc: 'يسمح للفريق برؤية إحصائيات المطاعم المغلقة والمُغرمة ضمن قطاعه الميداني شهرياً.' },
  issueFine: { title: 'إصدار غرامة مالية', desc: 'يمنح هذا الحساب صلاحية فرض غرامات وعقوبات مالية على المطاعم المخالفة وتوثيقها.' },
  closeEst: { title: 'إصدار أمر إغلاق (تشميع)', desc: 'إذن خطير: يعطي الحساب صلاحية اتخاذ قرار بإغلاق المطعم فوراً ومنعه من العمل.' },
  reopenEst: { title: 'إعادة فتح المنشأة', desc: 'يسمح برفع حظر الإغلاق عن المطعم وإعادته لحالة العمل الطبيعية بعد إزالة المخالفة.' },
  notify_closures: { title: 'إشعارات الإغلاقات والعقوبات', desc: 'يسمح بوصول إشعارات المصادقة على الإغلاق أو إصدار الغرامات الميدانية (خاص بالفرق الميدانية والرقابة المركزية).' },
  notify_inspections: { title: 'إشعارات الكشوفات والمهام', desc: 'يسمح بوصول إشعارات إضافة كشف جديد أو طلبات إعادة الكشف.' },
  notify_directives: { title: 'إشعارات التبليغات الإدارية', desc: 'يسمح بوصول إشعارات القرارات الإدارية، اجتماعات المجلس، ونداءات الاستغاثة (مهم جداً للمدير العام).' },
  exportData: { title: 'تصدير التقارير', desc: 'يسمح بتنزيل بيانات المنظومة وجداول المطاعم على شكل ملفات Excel أو PDF لغرض الأرشفة.' },
  viewAuditLogs: { title: 'سجل النشاطات (المراقبة)', desc: 'يسمح للحساب برؤية سجل المراقبة لمعرفة "من قام بماذا" داخل النظام (متى تم التعديل ومن عدّله).' },
  manageAccounts: { title: 'إدارة الحسابات الميدانية', desc: 'يعطي الحساب القدرة على رؤية حسابات الفرق واللجان الميدانية في نينوى.' },
  manageSettings: { title: 'إعدادات النظام والبنود', desc: 'إذن خطير جداً: يسمح بتعديل بنود الكشف الـ 30 الأساسية وأوزانها وإعدادات المنظومة ككل.' },
  backupData: { title: 'النسخ الاحتياطي', desc: 'يسمح للحساب بأخذ نسخة احتياطية من كامل قاعدة بيانات المنظومة وتنزيلها.' }
};

export const ROLE_CORE_BASICS = {
  director: ['showMainDashboard', 'showOperationsRoom', 'showFieldTeamsStats', 'showDirectivesPage', 'closeEst', 'issueFine'],
  central_director: ['showMainDashboard', 'showOperationsRoom', 'showFieldTeamsStats', 'showDirectivesPage', 'closeEst', 'issueFine'],
  accountant: ['showMainDashboard', 'managePayments'],
  financial_accountant: ['showMainDashboard', 'managePayments'],
  team: ['showMainDashboard', 'manageEstablishments', 'createEst', 'addEval'],
  lab: ['showMainDashboard', 'showLabPage'],
  tracker: ['showMainDashboard', 'showPublicEvalsPage', 'showDeliveryPage']
};

export const PERMISSION_ROLES = {
  // 'management' only permissions
  deleteEst: 'management',
  showMainDashboard: 'management',
  showOperationsRoom: 'management',
  showReportsPage: 'management',
  showPublicEvalsPage: 'management',
  sendDirective: 'management',
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
  canSendSOS: 'team',
  showSectorMap: 'team',
  showSmartTasks: 'team',
  showTeamMonthlyStats: 'team',
  
  // 'all' by default for the rest, but we can explicitly list them or rely on the fallback
};
