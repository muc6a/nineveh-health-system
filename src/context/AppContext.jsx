import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set } from 'firebase/database';

export const AppContext = createContext();

const INITIAL_ACTIVITY_TYPES = [
  '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
  '🪒 صالون حلاقة وتجميل نسائي',
  '🪒 صالون حلاقة رجالي',
  '🍞 مخابز وأفران',
  '☕ بيع وطحن القهوة',
  '💧 محطة تعبئة وتصفية المياه R.O',
  '🛒 أسواق ومجمعات غذائية',
  '🏭 معمل ومصنع غذائي'
];
const INITIAL_ESTABLISHMENTS = [
  {
    id: 'est_new_1',
    name: 'مطعم لاماسو (Lamassu Restaurant)',
    type: 'المطاعم، الكافيهات، والمقاهي',
    owner: 'شركة لاماسو للخدمات السياحية',
    phone: '07700001111',
    accessCode: 'LAMA-99',
    licenseNumber: 'LIC-2026-N90',
    propertyNumber: '2م/2167/44',
    sector: 'مركز المحافظة - الجانب الأيسر',
    neighborhood: 'المجموعة الثقافية',
    lastInspection: '2026-06-25',
    score: 98,
    status: 'compliant',
    facebook: 'https://facebook.com/LamassuMosul',
    latitude: '36.3770',
    longitude: '43.1450',
    history: [
      { date: '2026-06-25', score: 98, notes: 'نظافة ممتازة للمطابخ وصالة المطعم والتزام تام بشروط التعقيم.' }
    ]
  },
  {
    id: 'est_new_2',
    name: 'شاورما لاند (Shawarma Land)',
    type: 'المطاعم، الكافيهات، والمقاهي',
    owner: 'إدارة شاورما لاند',
    phone: '07501112233',
    accessCode: 'SHAW-88',
    licenseNumber: 'LIC-2026-Z10',
    propertyNumber: '3أ/9082/11',
    sector: 'مركز المحافظة - الجانب الأيسر',
    neighborhood: 'حي الزهور',
    lastInspection: '2026-07-02',
    score: 0,
    status: 'closed',
    facebook: 'https://instagram.com/shawarma_land_iq',
    latitude: '36.3712',
    longitude: '43.1610',
    history: [
      { date: '2026-07-02', score: 91, notes: 'المطبخ والتهوية جيدة، والشهادات الصحية للعاملين سارية المفعول.' }
    ],
    hasDelivery: true
  },
  {
    id: 'est_new_3',
    name: 'مطاعم الجندول',
    type: 'المطاعم، الكافيهات، والمقاهي',
    owner: 'إدارة مطاعم الجندول',
    phone: '07718882233',
    accessCode: 'JAND-77',
    licenseNumber: 'LIC-2026-C44',
    propertyNumber: '12ب/4431/09',
    sector: 'مركز المحافظة - الجانب الأيسر',
    neighborhood: 'حي المهندسين',
    lastInspection: '2026-06-28',
    score: 95,
    status: 'compliant',
    facebook: 'https://facebook.com/jondol.mosul',
    latitude: '36.3688',
    longitude: '43.1554',
    history: [
      { date: '2026-06-28', score: 95, notes: 'مستوى التزام عالي بالنظافة والتخزين السليم للمواد الغذائية.' }
    ]
  },
  {
    id: 'est_new_4',
    name: 'صالون سحر الشرق للسيدات',
    type: 'صالونات الحلاقة ومراكز التجميل',
    owner: 'سحر عبد الرحمن',
    phone: '07705554433',
    accessCode: 'SAHR-66',
    licenseNumber: 'LIC-2026-B88',
    propertyNumber: '4ج/7721/01',
    sector: 'مركز المحافظة - الجانب الأيسر',
    neighborhood: 'حي النور',
    lastInspection: '2026-07-04',
    score: 82,
    status: 'monitoring',
    facebook: 'https://facebook.com/sahar_salon_mosul',
    latitude: '36.3621',
    longitude: '43.1650',
    history: [
      { date: '2026-07-04', score: 82, notes: 'تم توجيه إنذار أولي لتوفير جهاز تعقيم أدوات حراري إضافي.' }
    ]
  },
  {
    id: 'est_new_5',
    name: 'مشويات أبو رائد',
    type: 'المطاعم، الكافيهات، والمقاهي',
    owner: 'أبو رائد الحيالي',
    phone: '07702223344',
    accessCode: 'RAED-55',
    licenseNumber: 'LIC-2026-M11',
    propertyNumber: '11أ/1122/04',
    sector: 'مركز المحافظة - الجانب الأيمن',
    neighborhood: 'الموصل القديمة',
    lastInspection: '2026-07-01',
    score: 65,
    status: 'critical',
    facebook: 'https://facebook.com/abu_raid_kabab',
    latitude: '36.3421',
    longitude: '43.1256',
    history: [
      { date: '2026-07-01', score: 65, notes: 'مخالفات في طريقة حفظ اللحوم، وتوجيه إنذار نهائي قبل الإغلاق.' },
      { date: '2026-06-15', score: 70, notes: 'نقص في الشهادات الصحية للعمال.' }
    ]
  },
  {
    id: 'est_new_6',
    name: 'حلاقة الأناقة الرجالي',
    type: 'صالونات الحلاقة ومراكز التجميل',
    owner: 'محمد سالم',
    phone: '07709998877',
    licenseNumber: 'LIC-2026-H22',
    propertyNumber: '5م/8877/02',
    sector: 'مركز المحافظة - الجانب الأيسر',
    neighborhood: 'حي الجامعة',
    lastInspection: '2026-07-05',
    score: 88,
    status: 'compliant',
    facebook: 'https://facebook.com/alanaqa_barber',
    latitude: '36.3811',
    longitude: '43.1322',
    history: [
      { date: '2026-07-05', score: 88, notes: 'الالتزام بتعقيم الأدوات واستخدام أدوات الحلاقة ذات الاستخدام الواحد جيد.' }
    ]
  },
  {
    id: 'est_new_7',
    name: 'معمل ألبان نينوى الحديث',
    type: '🏭 معمل ومصنع غذائي',
    owner: 'شركة نينوى للصناعات الغذائية',
    phone: '07504443322',
    licenseNumber: 'LIC-2026-F14',
    propertyNumber: '29م/1100/10',
    sector: 'مركز المحافظة - الجانب الأيسر',
    neighborhood: 'الكرامة',
    lastInspection: '2026-07-06',
    score: 95,
    status: 'compliant',
    facebook: 'https://facebook.com/nineveh_dairy',
    latitude: '36.3500',
    longitude: '43.1900',
    history: [
      { date: '2026-07-06', score: 95, notes: 'ظروف التعقيم ممتازة ومطابقة للمواصفات القياسية العراقية.' }
    ]
  },
  {
    id: 'est_new_8',
    name: 'مقهى وكافيه البستان',
    type: 'المطاعم، الكافيهات، والمقاهي',
    owner: 'عمر هاشم',
    phone: '07718889900',
    licenseNumber: 'LIC-2026-C88',
    propertyNumber: '7أ/5543/08',
    sector: 'مركز المحافظة - الجانب الأيسر - الغابات',
    lastInspection: 'لم يزر بعد',
    score: 100,
    status: 'compliant',
    facebook: 'https://instagram.com/albustan_cafe',
    latitude: '36.3900',
    longitude: '43.1200',
    history: []
  },
  {
    id: 'est_new_9',
    name: 'مخبز الأمانة',
    type: 'المخابز، الأفران، ومعجنات الحلويات',
    owner: 'حسين علي',
    phone: '07721112233',
    licenseNumber: 'LIC-2026-X12',
    propertyNumber: '14ج/5533/02',
    sector: 'قضاء تلعفر',
    neighborhood: 'حي السعد',
    lastInspection: '2026-07-10',
    score: 92,
    status: 'compliant',
    facebook: '',
    latitude: '36.3750',
    longitude: '42.4500',
    history: []
  },
  {
    id: 'est_new_10',
    name: 'أسواق بركات تلعفر',
    type: 'الأسواق، السوبرماركت، ومخازن المواد الغذائية',
    owner: 'أحمد محمود',
    phone: '07504445566',
    licenseNumber: 'LIC-2026-Y45',
    propertyNumber: '9أ/4422/01',
    sector: 'قضاء تلعفر',
    neighborhood: 'مركز القضاء',
    lastInspection: '2026-06-20',
    score: 75,
    status: 'monitoring',
    facebook: '',
    latitude: '36.3800',
    longitude: '42.4600',
    history: []
  },
  {
    id: 'est_new_11',
    name: 'صيدلية الشفاء المركزية',
    type: 'الصيدليات ومذاخر الأدوية',
    owner: 'د. سيف الدين',
    phone: '07703332211',
    licenseNumber: 'LIC-2026-M88',
    propertyNumber: '11ب/2233/05',
    sector: 'مركز المحافظة - الجانب الأيمن',
    neighborhood: 'شارع الدواسة',
    lastInspection: '2026-07-05',
    score: 98,
    status: 'compliant',
    facebook: '',
    latitude: '36.3400',
    longitude: '43.1300',
    history: []
  }
];

const INITIAL_REPORTS = [
  {
    id: 'rep_1',
    date: '2026-07-01 10:30',
    establishmentName: 'حلويات القلعة الشهيرة',
    sector: 'المصارف',
    details: 'وجود علب تخزين مكشوفة في البهو الرئيسي للمعمل.',
    evidenceImage: null,
    isDelivery: true,
    status: 'pending'
  },
  {
    id: 'rep_2',
    date: '2026-06-30 21:15',
    establishmentName: 'مطاعم الجندول',
    sector: 'مركز المحافظة - الجانب الأيسر',
    details: 'المطعم مزدحم جداً ولا توجد تهوية كافية مما يسبب ضيق تنفس للزبائن.',
    evidenceImage: null,
    isDelivery: false,
    status: 'investigated'
  }
];
const DEFAULT_PERMISSIONS = {
  manageEstablishments: true,
  createEst: true,
  editEst: true,
  deleteEst: false,
  addEval: true,
  showMainDashboard: true,
  showReportsPage: true,
  showDirectivesPage: true,
  showPublicEvalsPage: true,
  sendDirective: false,
  replyDirective: true,
  canSendSOS: true,
  showSectorMap: true,
  showSmartTasks: true,
  showFieldTeamsStats: false,
  showTeamMonthlyStats: false,
  showOperationsRoom: false,

  notify_closures: true,
  notify_inspections: true,
  notify_directives: true
};

const INITIAL_TEAMS = [
  { 
    id: 'team_left', 
    name: 'اللجنة الرقابية لمركز المحافظة - الجانب الأيسر', 
    sector: 'مركز المحافظة - الجانب الأيسر', 
    email: 'left@ninveh.health.gov.iq', 
    phone: '07700011122', 
    username: 'team_left',
    password: 'password123',
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS },
    members: {
      doctors: ['د. أحمد صالح الجبوري'],
      assistants: ['مساعد علي البكري'],
      technicians: ['ملاحظ فني عمر المصلي']
    }
  },
  { 
    id: 'team_right', 
    name: 'اللجنة الرقابية لمركز المحافظة - الجانب الأيمن', 
    sector: 'مركز المحافظة - الجانب الأيمن', 
    email: 'right@ninveh.health.gov.iq', 
    phone: '07700022233', 
    username: 'team_right',
    password: 'password123',
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS },
    members: {
      doctors: ['د. زياد طارق الحيالي'],
      assistants: ['مساعد فهد محمود'],
      technicians: ['ملاحظ فني يوسف يونس']
    }
  },
  { 
    id: 'team_talafar', 
    name: 'اللجنة الرقابية الميدانية - قضاء تلعفر', 
    sector: 'قضاء تلعفر', 
    email: 'talafar@ninveh.health.gov.iq', 
    phone: '07700033344', 
    username: 'team_talafar',
    password: 'password123',
    active: true,
    permissions: { ...DEFAULT_PERMISSIONS },
    members: {
      doctors: ['د. لؤي يحيى الحمداني'],
      assistants: ['مساعد جاسم محمد'],
      technicians: ['ملاحظ فني مهند خالد']
    }
  }
];

const DEFAULT_INSPECTION_TEMPLATES = {
  'المطاعم، الكافيهات، والمقاهي': [
    { id: 1, section: 'A', sectionName: 'النظافة العامة', text: 'نظافة الأرضيات والجدران والأسقف', points: 5 },
    { id: 2, section: 'A', sectionName: 'النظافة العامة', text: 'نظافة الطاولات وأماكن تقديم الطعام', points: 5 },
    { id: 3, section: 'A', sectionName: 'النظافة العامة', text: 'التخلص من النفايات بطريقة صحية', points: 5 },
    { id: 4, section: 'A', sectionName: 'النظافة العامة', text: 'مكافحة الحشرات والقوارض', points: 5 },
    { id: 5, section: 'B', sectionName: 'سلامة الأغذية', text: 'صلاحية المواد الغذائية', points: 5 },
    { id: 6, section: 'B', sectionName: 'سلامة الأغذية', text: 'وجود بطاقة بيان للمواد', points: 5 },
    { id: 7, section: 'B', sectionName: 'سلامة الأغذية', text: 'طرق الخزن والتبريد والتجميد', points: 5 },
    { id: 8, section: 'B', sectionName: 'سلامة الأغذية', text: 'فصل المواد النيئة عن المطبوخة', points: 5 },
    { id: 9, section: 'B', sectionName: 'سلامة الأغذية', text: 'سلامة مصادر المياه والثلج', points: 5 },
    { id: 10, section: 'C', sectionName: 'العاملون', text: 'وجود بطاقة صحية للعاملين', points: 5 },
    { id: 11, section: 'C', sectionName: 'العاملون', text: 'الالتزام بالملابس الواقية', points: 5 },
    { id: 12, section: 'C', sectionName: 'العاملون', text: 'النظافة الشخصية', points: 5 },
    { id: 13, section: 'C', sectionName: 'العاملون', text: 'التدريب على الممارسات الصحية', points: 5 },
    { id: 14, section: 'D', sectionName: 'المطبخ والتحضير', text: 'نظافة المعدات والأدوات', points: 5 },
    { id: 15, section: 'D', sectionName: 'المطبخ والتحضير', text: 'درجات حرارة الحفظ والطهي', points: 5 },
    { id: 16, section: 'D', sectionName: 'المطبخ والتحضير', text: 'طريقة إعداد وتجهيز الطعام', points: 5 },
    { id: 17, section: 'D', sectionName: 'المطبخ والتحضير', text: 'منع التلوث المتبادل', points: 5 }
  ],
  'المخابز، الأفران، ومعجنات الحلويات': [
    { id: 1, section: 'A', sectionName: 'بيئة العمل والنظافة', text: 'نظافة منطقة العجن والخبز', points: 10 },
    { id: 2, section: 'A', sectionName: 'بيئة العمل والنظافة', text: 'نظافة الأسطح وطاولات العمل', points: 5 },
    { id: 3, section: 'A', sectionName: 'بيئة العمل والنظافة', text: 'خلو المكان من الحشرات والقوارض', points: 5 },
    { id: 4, section: 'A', sectionName: 'بيئة العمل والنظافة', text: 'تهوية مناسبة للتخلص من الحرارة والأبخرة', points: 5 },
    { id: 5, section: 'B', sectionName: 'سلامة المواد الأولية', text: 'صلاحية الطحين والمحسنات', points: 10 },
    { id: 6, section: 'B', sectionName: 'سلامة المواد الأولية', text: 'طرق خزن المواد الجافة', points: 5 },
    { id: 7, section: 'B', sectionName: 'سلامة المواد الأولية', text: 'سلامة مصادر المياه المستخدمة', points: 5 },
    { id: 8, section: 'B', sectionName: 'سلامة المواد الأولية', text: 'حفظ الأجبان والألبان (للمعجنات) في مبردات', points: 5 },
    { id: 9, section: 'C', sectionName: 'أدوات الإنتاج والخبز', text: 'نظافة ونوعية الأحواض والقطاعات', points: 10 },
    { id: 10, section: 'C', sectionName: 'أدوات الإنتاج والخبز', text: 'نظافة صواني الخبز والرفوف', points: 10 },
    { id: 11, section: 'C', sectionName: 'أدوات الإنتاج والخبز', text: 'الوقود المستخدم في الفرن آمن', points: 5 }
  ],
  'الأسواق، السوبرماركت، ومخازن المواد الغذائية': [
    { id: 1, section: 'A', sectionName: 'صلاحية المواد المعروضة', text: 'خلو الأرفف من المواد منتهية الصلاحية', points: 20 },
    { id: 2, section: 'A', sectionName: 'صلاحية المواد المعروضة', text: 'سلامة أغلفة المواد وعدم وجود تلف', points: 10 },
    { id: 3, section: 'A', sectionName: 'صلاحية المواد المعروضة', text: 'ظهور تواريخ الإنتاج والانتهاء بوضوح', points: 10 },
    { id: 4, section: 'B', sectionName: 'أجهزة التبريد والتجميد', text: 'مطابقة درجات حرارة المجمدات للشروط', points: 15 },
    { id: 5, section: 'B', sectionName: 'أجهزة التبريد والتجميد', text: 'مطابقة درجات حرارة البرادات للشروط', points: 10 },
    { id: 6, section: 'B', sectionName: 'أجهزة التبريد والتجميد', text: 'عدم تكدس المواد فوق الحد المسموح به', points: 5 },
    { id: 7, section: 'C', sectionName: 'طرق الخزن والنظافة العامة', text: 'ترتيب المواد على رفوف بعيداً عن الأرضية', points: 10 },
    { id: 8, section: 'C', sectionName: 'طرق الخزن والنظافة العامة', text: 'نظافة المخازن الرئيسية', points: 5 },
    { id: 9, section: 'C', sectionName: 'طرق الخزن والنظافة العامة', text: 'نظافة الأرضيات العامة للسوق', points: 5 }
  ],
  'صالونات الحلاقة ومراكز التجميل': [
    { id: 1, section: 'A', sectionName: 'التعقيم والأدوات', text: 'استخدام أجهزة تعقيم فعالة (UV/Autoclave)', points: 15 },
    { id: 2, section: 'A', sectionName: 'التعقيم والأدوات', text: 'تعقيم الأدوات المعدنية (مقصات، أمشاط، ملاقط) بعد كل زبون', points: 15 },
    { id: 3, section: 'A', sectionName: 'التعقيم والأدوات', text: 'استخدام أدوات ذات استخدام واحد (شفرات، مناشف ورقية)', points: 10 },
    { id: 4, section: 'B', sectionName: 'النظافة العامة للبنية التحتية', text: 'نظافة الأرضيات والجدران والمغاسل', points: 10 },
    { id: 5, section: 'B', sectionName: 'النظافة العامة للبنية التحتية', text: 'نظافة كراسي الحلاقة وأماكن الانتظار', points: 5 },
    { id: 6, section: 'B', sectionName: 'النظافة العامة للبنية التحتية', text: 'تهوية المكان والإضاءة', points: 5 },
    { id: 7, section: 'C', sectionName: 'المستحضرات ومواد التجميل', text: 'تاريخ صلاحية المواد التجميلية (كريمات، أصباغ)', points: 10 },
    { id: 8, section: 'C', sectionName: 'المستحضرات ومواد التجميل', text: 'ظروف خزن المواد وسلامة العبوات', points: 5 },
    { id: 9, section: 'C', sectionName: 'المستحضرات ومواد التجميل', text: 'وجود بطاقة بيان للمواد الكيميائية', points: 5 }
  ],
  'قاعات الأعراس والمناسبات': [
    { id: 1, section: 'A', sectionName: 'المطبخ والتحضير', text: 'نظافة مطبخ القاعة والشروط الصحية فيه', points: 15 },
    { id: 2, section: 'A', sectionName: 'المطبخ والتحضير', text: 'نظافة الأواني والصحون', points: 10 },
    { id: 3, section: 'A', sectionName: 'المطبخ والتحضير', text: 'طرق حفظ الأطعمة المطبوخة', points: 5 },
    { id: 4, section: 'B', sectionName: 'سلامة الأغذية المقدمة', text: 'صلاحية الأطعمة المقدمة في البوفيه', points: 10 },
    { id: 5, section: 'B', sectionName: 'سلامة الأغذية المقدمة', text: 'فصل اللحوم عن الخضار', points: 5 },
    { id: 6, section: 'B', sectionName: 'سلامة الأغذية المقدمة', text: 'سلامة مياه الشرب والثلج', points: 10 },
    { id: 7, section: 'C', sectionName: 'الموقع والصحيات', text: 'نظافة القاعة العامة', points: 10 },
    { id: 8, section: 'C', sectionName: 'الموقع والصحيات', text: 'نظافة وتعقيم الصحيات (دورات المياه)', points: 10 }
  ],
  'الصيدليات ومذاخر الأدوية': [
    { id: 1, section: 'A', sectionName: 'خزن الأدوية ودرجات الحرارة', text: 'سلامة عمل أجهزة التكييف والمولدات 24/7', points: 15 },
    { id: 2, section: 'A', sectionName: 'خزن الأدوية ودرجات الحرارة', text: 'مطابقة درجة حرارة الصيدلية العامة', points: 10 },
    { id: 3, section: 'A', sectionName: 'خزن الأدوية ودرجات الحرارة', text: 'مطابقة درجة حرارة البرادات للأدوية الحساسة', points: 15 },
    { id: 4, section: 'B', sectionName: 'صلاحية الأدوية', text: 'خلو الأرفف من الأدوية منتهية الصلاحية', points: 20 },
    { id: 5, section: 'B', sectionName: 'صلاحية الأدوية', text: 'نظام فصل الأدوية القريبة من الانتهاء', points: 5 },
    { id: 6, section: 'B', sectionName: 'صلاحية الأدوية', text: 'سلامة الأدوية المخزنة من الرطوبة والحرارة', points: 5 },
    { id: 7, section: 'C', sectionName: 'التخلص من النفايات الطبية', text: 'وجود حاويات خاصة للأدوية التالفة والمنتهية', points: 10 },
    { id: 8, section: 'C', sectionName: 'التخلص من النفايات الطبية', text: 'التعاقد مع شركة متخصصة للتخلص الآمن من النفايات', points: 10 }
  ]
};

const INITIAL_DELIVERIES = [];

export const AppProvider = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [currentRoute, setCurrentRoute] = useState(() => {
    return localStorage.getItem('currentRoute') || '/';
  });

  useEffect(() => {
    localStorage.setItem('currentRoute', currentRoute);
  }, [currentRoute]);

  const [routeParams, setRouteParams] = useState({});

  // Core Databases
  const [establishments, setEstablishments] = useState(() => {
    const saved = localStorage.getItem('establishments');
    let parsed = saved ? JSON.parse(saved) : null;
    
    // Only use INITIAL_ESTABLISHMENTS if there's no saved data at all
    if (!parsed) {
      parsed = [...INITIAL_ESTABLISHMENTS];
    }
    
    // Deduplicate by name (in case old local storage has duplicates)
    const uniqueMap = new Map();
    parsed.forEach(est => {
      uniqueMap.set(est.name.trim(), est);
    });
    
    return Array.from(uniqueMap.values()).map(est => {
      // Migrate sector strings to standardize them (e.g. "مركز المحافظة - الجانب الأيسر - حي الزهور" -> "مركز المحافظة - الجانب الأيسر")
      let currentSector = est.sector || '';
      let currentNeighborhood = est.neighborhood || '';
      if (currentSector.includes(' - ')) {
        const parts = currentSector.split(' - ');
        if (parts[0].trim() === 'مركز المحافظة' && parts.length > 1) {
          currentSector = parts[0].trim() + ' - ' + parts[1].trim();
          if (parts.length > 2 && !currentNeighborhood) currentNeighborhood = parts.slice(2).join(' - ').trim();
        } else {
          currentSector = parts[0].trim();
          if (parts.length > 1 && !currentNeighborhood) currentNeighborhood = parts.slice(1).join(' - ').trim();
        }
      }

      return {
        ...est,
        sector: currentSector,
        neighborhood: currentNeighborhood,
        accessCode: est.accessCode || est.id.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase()
      };
    });
  });

  // --- NEW: Smart Tasks for Trackers ---
  const INITIAL_TASKS = [
    {
      id: 'task_1',
      title: 'شكوى تسمم - مطعم كرز',
      description: 'يرجى التوجه فوراً للتأكد من نظافة المطعم بناءً على شكوى وردت لغرفة العمليات.',
      targetEstId: 'est_2',
      assignedTo: 'tracker_1',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('trackerTasks_v1');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [accountants, setAccountants] = useState(() => {
    const saved = localStorage.getItem('nineveh_accountants');
    return saved ? JSON.parse(saved) : [];
  });

  const [finesBooklet, setFinesBooklet] = useState(() => {
    const saved = localStorage.getItem('nineveh_fines_booklet');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', type: 'عدم وجود إجازة صحية', amount: 500000, requiresClosure: true },
      { id: 'f2', type: 'سوء النظافة العامة', amount: 150000, requiresClosure: false },
      { id: 'f3', type: 'وجود مواد منتهية الصلاحية', amount: 250000, requiresClosure: false }
    ];
  });

  const [fineTransactions, setFineTransactions] = useState(() => {
    const saved = localStorage.getItem('nineveh_fine_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams_v2');
    let parsed = saved ? JSON.parse(saved) : null;
    
    // Only use INITIAL_TEAMS if there's no saved data at all
    if (!parsed) {
      parsed = [...INITIAL_TEAMS];
    }
    
    return parsed.map(team => {
      let currentSector = team.sector || '';
      let currentNeighborhoods = team.assignedNeighborhoods || [];
      if (currentSector.includes(' - ')) {
        const parts = currentSector.split(' - ');
        if (parts[0].trim() === 'مركز المحافظة' && parts.length > 1) {
          currentSector = parts[0].trim() + ' - ' + parts[1].trim();
          if (parts.length > 2 && currentNeighborhoods.length === 0) currentNeighborhoods = parts.slice(2).join(' - ').split('،').map(s => s.trim());
        } else {
          currentSector = parts[0].trim();
          if (parts.length > 1 && currentNeighborhoods.length === 0) currentNeighborhoods = parts.slice(1).join(' - ').split('،').map(s => s.trim());
        }
      }
      return { ...team, sector: currentSector, assignedNeighborhoods: currentNeighborhoods };
    });
  });

  const INITIAL_TRACKERS = [
    {
      id: 'tracker_1',
      name: 'المتابع السري الأول',
      username: 'tracker_left',
      password: 'password123',
      linkedTeamSector: 'مركز المحافظة - الجانب الأيسر',
      sector: 'مركز المحافظة - الجانب الأيسر',
      active: true
    }
  ];

  const [trackers, setTrackers] = useState(() => {
    const saved = localStorage.getItem('trackers_v1');
    const parsed = saved ? JSON.parse(saved) : INITIAL_TRACKERS;
    
    return parsed.map(tracker => {
      let currentSector = tracker.linkedTeamSector || tracker.sector || '';
      let currentNeighborhoods = tracker.assignedNeighborhoods || [];
      if (currentSector.includes(' - ')) {
        const parts = currentSector.split(' - ');
        if (parts[0].trim() === 'مركز المحافظة' && parts.length > 1) {
          currentSector = parts[0].trim() + ' - ' + parts[1].trim();
          if (parts.length > 2 && currentNeighborhoods.length === 0) currentNeighborhoods = parts.slice(2).join(' - ').split('،').map(s => s.trim());
        } else {
          currentSector = parts[0].trim();
          if (parts.length > 1 && currentNeighborhoods.length === 0) currentNeighborhoods = parts.slice(1).join(' - ').split('،').map(s => s.trim());
        }
      }
      return { ...tracker, linkedTeamSector: currentSector, sector: currentSector, assignedNeighborhoods: currentNeighborhoods };
    });
  });



  const [closureVerifications, setClosureVerifications] = useState(() => {
    const saved = localStorage.getItem('closureVerifications_v1');
    return saved ? JSON.parse(saved) : [];
  });



  const [inspectionTemplates, setInspectionTemplates] = useState(() => {
    const saved = localStorage.getItem('inspectionTemplates_v3');
    return saved ? JSON.parse(saved) : DEFAULT_INSPECTION_TEMPLATES;
  });

  // Super Admin Configuration parameters
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('systemConfig');
    return saved ? JSON.parse(saved) : {
      headerText: 'منظومة الرقابة الصحية الرقمية - محافظة نينوى',
      allowImageUpload: true,
      allowExternalReports: true,
      allowOwnerPortal: true,
      imageRetention: '6 Months',
      reportRetentionDays: 30,
      uiScale: 'normal', // small, normal, large
      brandingVideo: '/logo-animated.mp4',
      passingScore: 90,
      warningScore: 70,
      maintenanceMode: false,
      landingGreeting: "مرحباً بكم في",
      landingTitle: "منظومة الرقابة الصحية",
      landingSubtitle: "نافذتكم الموثوقة لضمان بيئة صحية آمنة. اختر البوابة المناسبة لك للوصول إلى الخدمات الرقمية بكل سهولة وسرعة.",
      citizensPortalTitle: "بوابة المواطنين",
      citizensPortalDesc: "للبحث عن المنشآت، الاطلاع على تقييماتها الصحية، وتقديم الشكاوى والبلاغات إلكترونياً.",
      citizensPortalBtn: "الدخول للبحث والإبلاغ",
      ownersPortalTitle: "بوابة أصحاب المنشآت",
      ownersPortalDesc: "دخول مخصص لأصحاب المنشآت لمتابعة التقييمات خطط العمل والشهادات الصحية الخاصة بهم.",
      ownersPortalBtn: "الدخول كصاحب منشأة"
    };
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('auditLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const activityTypes = Object.keys(inspectionTemplates);

  useEffect(() => {
    syncToCloud('auditLogs', auditLogs);
  }, [auditLogs]);

  // Global Broadcast State
  const [globalBroadcast, setGlobalBroadcast] = useState(() => {
    const saved = localStorage.getItem('globalBroadcast');
    return saved ? JSON.parse(saved) : { active: false, message: '', sender: '', timestamp: '', acknowledgedBy: [] };
  });

  useEffect(() => {
    syncToCloud('globalBroadcast', globalBroadcast);
  }, [globalBroadcast]);

  // Sync state across tabs in real-time and handle offline/online sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'globalBroadcast' && e.newValue) {
        setGlobalBroadcast(JSON.parse(e.newValue));
      } else if (e.key === 'auditLogs' && e.newValue) {
        setAuditLogs(JSON.parse(e.newValue));
      } else if (e.key === 'establishments' && e.newValue) {
        setEstablishments(JSON.parse(e.newValue));
      } else if (e.key === 'reports' && e.newValue) {
        setReports(JSON.parse(e.newValue));
      } else if (e.key === 'systemConfig' && e.newValue) {
        setConfig(JSON.parse(e.newValue));

      } else if (e.key === 'teams' && e.newValue) {
        setTeams(JSON.parse(e.newValue));
      } else if (e.key === 'penaltyRequests' && e.newValue) {
        setPenaltyRequests(JSON.parse(e.newValue));
      } else if (e.key === 'deliveries' && e.newValue) {
        setDeliveries(JSON.parse(e.newValue));
      } else if (e.key === 'dispatches' && e.newValue) {
        setDispatches(JSON.parse(e.newValue));
      }
    };
    
    const handleOnline = () => {
      // Simulate syncing offline data when internet returns
      const offlineFlag = localStorage.getItem('has_offline_data');
      if (offlineFlag) {
        notify('عاد الاتصال بالإنترنت! جاري المزامنة التلقائية...', 'info', true);
        setTimeout(() => {
          notify('تمت مزامنة جميع التقارير المخزنة بنجاح مع المديرية.', 'success', true);
          localStorage.removeItem('has_offline_data');
        }, 3000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Sync state from Firebase Realtime Database on initial load and keep it synced
  useEffect(() => {
    try {
      const setupFirebaseSync = (key, setter, localFallback) => {
        const dbRef = ref(db, 'prototype_state/' + key);
        let isFirstLoad = true;
        
        // Listen for changes from Firebase
        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setter(data);
            localStorage.setItem(key, JSON.stringify(data));
          } else if (isFirstLoad && localFallback && (!Array.isArray(localFallback) || localFallback.length > 0)) {
            // If Firebase is empty on first load and we have meaningful local fallback, initialize Firebase
            set(dbRef, localFallback);
          } else {
            // Firebase node was deleted or is genuinely empty
            const emptyData = Array.isArray(localFallback) ? [] : null;
            setter(emptyData);
            localStorage.setItem(key, JSON.stringify(emptyData));
          }
          isFirstLoad = false;
        }, (error) => {
          console.error('Firebase Sync Error for', key, error);
          // Fallback to local storage
          const saved = localStorage.getItem(key);
          if (saved) setter(JSON.parse(saved));
        });
      };

      setupFirebaseSync('establishments', setEstablishments, establishments);
      setupFirebaseSync('reports', setReports, reports);
      setupFirebaseSync('teams_v2', setTeams, teams);
      setupFirebaseSync('trackers_v1', setTrackers, trackers);
      setupFirebaseSync('closureVerifications_v1', setClosureVerifications, closureVerifications);
      setupFirebaseSync('inspectionTemplates_v3', setInspectionTemplates, inspectionTemplates);
      setupFirebaseSync('systemConfig', setConfig, config);

      setupFirebaseSync('auditLogs', setAuditLogs, auditLogs);
      setupFirebaseSync('globalBroadcast', setGlobalBroadcast, globalBroadcast);
      setupFirebaseSync('systemTickets', setTickets, tickets);
      setupFirebaseSync('chatMessages', setChatMessages, chatMessages);
      setupFirebaseSync('trackerTasks_v1', setTasks, tasks);
      setupFirebaseSync('sysNotifs', setSystemNotifications, systemNotifications);
      setupFirebaseSync('publicCMS', setPublicCMS, publicCMS);
      setupFirebaseSync('loginCMS', setLoginCMS, loginCMS);
      setupFirebaseSync('ownerCMS', setOwnerCMS, ownerCMS);
      setupFirebaseSync('directives', setDirectives, directives);
      setupFirebaseSync('directors', setDirectors, directors);
      setupFirebaseSync('deliveries', setDeliveries, deliveries);
      setupFirebaseSync('penaltyRequests_v2', setPenaltyRequests, penaltyRequests);
      setupFirebaseSync('dispatches', setDispatches, dispatches);
      setupFirebaseSync('fines', setFines, fines);
      setupFirebaseSync('nineveh_accountants', setAccountants, accountants);
      setupFirebaseSync('nineveh_fines_booklet', setFinesBooklet, finesBooklet);
      setupFirebaseSync('nineveh_fine_transactions', setFineTransactions, fineTransactions);
    } catch (err) {
      console.error("Firebase load error", err);
    }
  }, []);

  const logAudit = (action, entityId, oldData, newData, justification, userDetails) => {
    const newLog = {
      id: 'audit_' + Date.now(),
      date: new Date().toISOString(),
      action,
      entityId,
      oldData,
      newData,
      justification,
      user: userDetails?.name || 'مستخدم غير معروف',
      role: userDetails?.role || 'team'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Feedback tickets state
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('systemTickets');
    return saved ? JSON.parse(saved) : [
      { id: 't1', type: 'bug', text: 'رصد تداخل بسيط في نطاق حي الزهور مع حي المصارف بالمخططات.', teamName: 'اللجنة الرقابية الأولى', status: 'open' },
      { id: 't2', type: 'feature', text: 'نقترح إضافة خيار طباعة تقرير الكشف بصيغة PDF مباشرة من الميدان.', teamName: 'د. عماد (المدير العام)', status: 'resolved' }
    ];
  });

  const addTicket = (type, text, teamName) => {
    const newTicket = {
      id: 'ticket_' + Date.now(),
      type,
      text,
      teamName: teamName || 'مستخدم غير معروف',
      status: 'open'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Synchronize current user with the latest data from account arrays
  useEffect(() => {
    if (!user) return;
    
    let updatedUser = null;
    
    if (user.role === 'admin' || user.isDirector) {
      updatedUser = directors.find(d => d.id === user.id);
    } else if (user.role === 'tracker') {
      updatedUser = trackers.find(t => t.id === user.id);
    } else if (user.role === 'accountant' || user.role === 'financial_accountant') {
      updatedUser = accountants.find(a => a.id === user.id);
    } else if (user.isTeam || user.role === 'field_team' || user.role === 'team') {
      updatedUser = teams.find(t => t.id === user.id);
    }
    
    if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(user)) {
      setUser(updatedUser);
    }
  }, [teams, accountants, trackers, directors]);

  const [deliveries, setDeliveries] = useState(() => {
    const saved = localStorage.getItem('deliveries');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });
  
  useEffect(() => {
    syncToCloud('deliveries', deliveries);
  }, [deliveries]);

  const [penaltyRequests, setPenaltyRequests] = useState(() => {
    const saved = localStorage.getItem('penaltyRequests_v2');
    return saved ? JSON.parse(saved) : [];
  });


  const [dispatches, setDispatches] = useState(() => {
    const saved = localStorage.getItem('dispatches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    syncToCloud('dispatches', dispatches);
  }, [dispatches]);

  // Fines Record State
  const [fines, setFines] = useState(() => {
    const saved = localStorage.getItem('fines');
    return saved ? JSON.parse(saved) : [
      {
        id: 'fine_1',
        targetEstId: 'est_new_3',
        amount: '500,000',
        reason: 'عدم الالتزام بالشروط الصحية وتكرار المخالفات',
        date: new Date().toISOString(),
        status: 'unpaid'
      }
    ];
  });

  useEffect(() => {
    syncToCloud('fines', fines);
  }, [fines]);

  // Global Notification System
  const [notification, setNotification] = useState({ message: '', type: 'info', id: 0 });

  // User UI Preferences (Density & Typography)
  const [uiPreferences, setUiPreferences] = useState(() => {
    const saved = localStorage.getItem('uiPreferences');
    const savedPrefs = saved ? JSON.parse(saved) : {};
    return {
      headingSize: savedPrefs.headingSize || '18px',
      bodySize: savedPrefs.bodySize || '12px',
      density: savedPrefs.density || 'comfortable',
      tabOrder: savedPrefs.tabOrder || ['strategic', 'team_reports', 'operations_room', 'geographic', 'directives', 'complaints', 'establishments']
    };
  });

  const [showDisplayPrefsModal, setShowDisplayPrefsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('uiPreferences', JSON.stringify(uiPreferences));
    
    // Apply preferences to document body/root for easy CSS variable usage
    document.documentElement.style.setProperty('--heading-size', uiPreferences.headingSize);
    document.documentElement.style.setProperty('--body-size', uiPreferences.bodySize);
    
    if (uiPreferences.density === 'compact') {
      document.documentElement.classList.add('density-compact');
    } else {
      document.documentElement.classList.remove('density-compact');
    }
  }, [uiPreferences]);

  // Persistent System Notifications for the Bell Icon
  const [systemNotifications, setSystemNotifications] = useState(() => {
    const saved = localStorage.getItem('sysNotifs');
    return saved ? JSON.parse(saved) : [];
  });

  const addSystemNotification = (title, message, targetRole = 'all') => {
    const newNotif = {
      id: 'notif_' + Date.now() + Math.floor(Math.random() * 1000),
      title,
      message,
      targetRole, // 'all', 'admin', 'director', 'central_director', or specific team id
      date: new Date().toISOString(),
      isRead: false
    };
    setSystemNotifications(prev => [newNotif, ...prev]);
  };

  const [sosAlerts, setSosAlerts] = useState(() => {
    const saved = localStorage.getItem('sosAlerts');
    return saved ? JSON.parse(saved) : [];
  });
  // --- Live Support Chat System ---
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });

  const addChatMessage = (targetRole, targetSector, text, senderName, senderRole, senderSector, senderId) => {
    const newMsg = {
      id: 'msg_' + Date.now(),
      targetRole, // e.g. 'operations', 'accountant', 'team'
      targetSector, // e.g. 'الجانب الأيسر', 'الجانب الأيمن', 'all'
      text,
      senderName,
      senderRole,
      senderSector,
      senderId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setChatMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  const markChatRead = (msgId) => {
    setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, isRead: true } : m));
  };
  // --------------------------------
  const triggerSOSAlert = (teamInfo, locationInfo) => {
    const newAlert = {
      id: 'sos_' + Date.now(),
      teamName: teamInfo?.name || 'فريق غير معروف',
      teamId: teamInfo?.id || 'unknown',
      sector: teamInfo?.sector || 'غير محدد',
      location: locationInfo || 'موقع غير متوفر',
      date: new Date().toISOString(),
      status: 'active'
    };
    setSosAlerts(prev => [newAlert, ...prev]);
    
    // Also notify central ops
    addSystemNotification(
      '🚨 نداء استغاثة (SOS) عاجل!',
      `الفريق: ${newAlert.teamName} في قطاع ${newAlert.sector} يطلب الإسناد الفوري.`,
      'central_director'
    );
  };

  const playBeep = (type) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Different tone based on type
      if (type === 'error') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.08); // double beep
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
      }
    } catch (e) {
      console.log('Audio disabled by browser policy');
    }
  };

  const notify = (message, type = 'info', playSound = false) => {
    if (playSound) playBeep(type);
    setNotification({ message, type, id: Date.now() });
  };

  const syncToCloud = async (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    try {
      const dbRef = ref(db, 'prototype_state/' + key);
      await set(dbRef, data);
    } catch (err) {
      console.error('Firebase Write Error:', err);
      if (key === 'teams_v2') {
        notify('خطأ في الاتصال بقاعدة البيانات! يرجى التأكد من تفعيل Realtime Database في وضع الاختبار.', 'error');
      }
    }
  };

  // Use refs to prevent initial mount sync from overwriting cloud data
  const isMountedAcc = React.useRef(false);
  const isMountedFinesBooklet = React.useRef(false);
  const isMountedFineTrans = React.useRef(false);
  const isMountedEst = React.useRef(false);
  const isMountedRep = React.useRef(false);
  const isMountedTeam = React.useRef(false);
  const isMountedTrack = React.useRef(false);
  const isMountedClosure = React.useRef(false);
  const isMountedInsp = React.useRef(false);
  const isMountedConf = React.useRef(false);
  const isMountedTick = React.useRef(false);
  const isMountedNotif = React.useRef(false);
  const isMountedTasks = React.useRef(false);
  const isMountedSos = React.useRef(false);
  const isMountedDir = React.useRef(false);
  const isMountedDirst = React.useRef(false);
  const isMountedDeliv = React.useRef(false);
  const isMountedPen = React.useRef(false);
  const isMountedDisp = React.useRef(false);


  // Public Search Page CMS
  const [publicCMS, setPublicCMS] = useState(() => {
    const saved = localStorage.getItem('publicCMS');
    const parsed = saved ? JSON.parse(saved) : null;
    
    if (parsed && parsed.heroTitle === 'ابحث عن مطاعم ومقاهي نينوى') {
      parsed.heroTitle = 'ابحث عن المنشآت في محافظة نينوى';
      parsed.heroSubtext = 'استعلم عن التقييم الصحي (مثل المطاعم، المقاهي، الصالونات وغيرها) ومدى التزامها بالشروط الصحية، أو قدم شكوى مباشرة لفرق التفتيش.';
    }

    return parsed || {
      heroTitle: 'ابحث عن المنشآت في محافظة نينوى',
      heroSubtext: 'استعلم عن التقييم الصحي (مثل المطاعم، المقاهي، الصالونات وغيرها) ومدى التزامها بالشروط الصحية، أو قدم شكوى مباشرة لفرق التفتيش.',
      announcement: ''
    };
  });

  useEffect(() => {
    syncToCloud('publicCMS', publicCMS);
  }, [publicCMS]);
  const [loginCMS, setLoginCMS] = useState(() => {
    const saved = localStorage.getItem('loginCMS');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'بوابة تسجيل الدخول الإلكتروني',
      heroSubtext: 'بوابة مخصصة للمفتشين واللجان الميدانية',
      announcement: '',
      customLink: ''
    };
  });

  useEffect(() => {
    syncToCloud('loginCMS', loginCMS);
  }, [loginCMS]);

  const [ownerCMS, setOwnerCMS] = useState(() => {
    const saved = localStorage.getItem('ownerCMS');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'بوابة أصحاب المنشآت',
      heroSubtext: 'يرجى إدخال الكود السري (PIN) المُسلم لك من قبل فرق الرقابة الصحية للاطلاع على التقرير.',
      announcement: '',
      customLink: ''
    };
  });

  useEffect(() => {
    syncToCloud('ownerCMS', ownerCMS);
  }, [ownerCMS]);


  // Handle HTML document class for theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Navigate function mimicking react-router
  const navigate = (path) => {
    // Parse params if any, e.g. /scan/rest_1 -> /scan/:id
    let parsedPath = path;
    let params = {};
    if (path.startsWith('/scan/')) {
      const id = path.split('/')[2];
      parsedPath = '/scan/:qr_id';
      params = { qr_id: id };
    }
    
    // Strip query parameters for routing lookup
    if (parsedPath.includes('?')) {
      parsedPath = parsedPath.split('?')[0];
    }
    
    setCurrentRoute(parsedPath);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update address bar for realism (without triggering page reload)
    window.history.pushState(null, '', path);
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname + window.location.search;
      navigate(path);
    };
    window.addEventListener('popstate', handlePopState);
    
    // Set initial route based on URL path and search query params
    const initialPath = window.location.pathname + window.location.search;
    navigate(initialPath || '/');
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global actions
  const addEstablishment = (establishment) => {
    const newEst = {
      ...establishment,
      id: 'rest_' + Date.now(),
      score: 100,
      status: 'compliant',
      lastInspection: 'لم يزر بعد',
      history: [],
      accessCode: Math.random().toString(36).substring(2, 8).toUpperCase()
    };
    setEstablishments(prev => [newEst, ...prev]);
    return newEst;
  };

  const updateEstablishment = (id, updatedFields) => {
    setEstablishments(prev => prev.map(est => est.id === id ? { ...est, ...updatedFields } : est));
  };

  const deleteEstablishment = (id) => {
    setEstablishments(prev => prev.filter(est => est.id !== id));
  };

  const addInspection = (establishmentId, score, notes, selectedRatings, inspectorName, coords, isEdit = false, teamId = null, photoBase64 = null, aiReport = null, signatureData = null, ownerPhoto = null) => {
    const status = score >= 90 ? 'compliant' : score >= 70 ? 'monitoring' : 'non_compliant';
    const date = new Date().toISOString().split('T')[0];
    
    let targetEstName = '';

    setEstablishments(prev => prev.map(est => {
      if (est.id === establishmentId) {
        targetEstName = est.name;
        let updatedHistory = [...(est.history || [])];
        const newEntry = { date, score, notes, inspectorName, ratings: selectedRatings, photo: photoBase64, aiReport, signatureData, ownerPhoto };
        if (isEdit && updatedHistory.length > 0) {
          updatedHistory[0] = newEntry;
        } else {
          updatedHistory = [newEntry, ...updatedHistory];
        }
        return {
          ...est,
          score,
          status,
          lastInspection: date,
          inspectorName: inspectorName || 'اللجنة الرقابية العامة',
          ratings: selectedRatings,
          history: updatedHistory,
          latitude: coords?.lat || est.latitude || '36.3489',
          longitude: coords?.lon || est.longitude || '43.1578'
        };
      }
      return est;
    }));

    if (teamId && coords) {
      setTeams(prev => prev.map(t => {
        if (t.id === teamId) {
          return {
            ...t,
            lastLocation: { lat: coords.lat, lon: coords.lon, timestamp: new Date().toLocaleString('ar-IQ'), estName: targetEstName }
          };
        }
        return t;
      }));
    }
  };

  const addReport = (reportData) => {
    const newReport = {
      ...reportData,
      id: 'rep_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);

    // Notify ops_room automatically for every new citizen complaint
    const deliveryLabel = reportData.isDelivery ? '(بلاغ خاص بخدمة التوصيل)' : '(بلاغ عن صالة المطعم)';
    addSystemNotification(
      `⚠️ بلاغ مدني جديد ${deliveryLabel}`,
      `ورد بلاغ سري جديد بشأن منشأة "${reportData.establishmentName}" (${reportData.sector || 'غير محدد القطاع'}). يرجى مراجعة البلاغات الواردة في لوحة الشكاوى.`,
      'ops_room'
    );
  };

  const [directives, setDirectives] = useState(() => {
    const saved = localStorage.getItem('directives');
    return saved ? JSON.parse(saved) : [
      {
        id: 'dir_1',
        date: '2026-07-01 09:00',
        teamId: 'team_1',
        text: 'يرجى تكثيف الرقابة على مطاعم منطقة الغابات والتأكد من بطاقات فحص العاملين الصحية فوراً.',
        sender: 'مدير الصحة'
      }
    ];
  });

  const [directors, setDirectors] = useState(() => {
    const saved = localStorage.getItem('directors');
    let parsed = saved ? JSON.parse(saved) : null;
    
    if (parsed) {
      // Force migration for dir_acc_2 from Jassim to Dr. Ibtihal
      const hasJassim = parsed.some(d => d.id === 'dir_acc_2' && d.name.includes('جاسم'));
      let needsMigration = false;
      
      parsed = parsed.map(d => {
        if (d.id === 'dir_acc_2' && hasJassim) {
          needsMigration = true;
          return { id: 'dir_acc_2', name: 'دكتورة ابتهال غازي', role: 'central_director', title: 'مدير الرقابة المركزية', email: 'central_director@ninveh.health.gov.iq', phone: '07711223344', username: 'central_dir', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showDirectivesPage: true, sendDirective: true, manageEstablishments: true } };
        }
        return d;
      });

      if (needsMigration) {
        localStorage.setItem('directors', JSON.stringify(parsed));
      }
      return parsed;
    }

    return [
      { id: 'dir_acc_1', name: 'د. عماد محمد عبد الله', role: 'director', title: 'مدير عام صحة نينوى', email: 'director@ninveh.health.gov.iq', phone: '07700000000', username: 'emad_dg', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showPublicEvalsPage: true, showDirectivesPage: true, sendDirective: true, replyDirective: true, notify_closures: false, notify_inspections: false, notify_directives: true } },
      { id: 'dir_acc_2', name: 'دكتورة ابتهال غازي', role: 'central_director', title: 'مدير الرقابة المركزية', email: 'central_director@ninveh.health.gov.iq', phone: '07711223344', username: 'central_dir', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS, showMainDashboard: true, showReportsPage: true, showDirectivesPage: true, sendDirective: true, manageEstablishments: true, notify_closures: true, notify_inspections: true, notify_directives: true } }
    ];
  });

  const addDirective = (teamId, text, senderName = 'مدير الصحة', senderId = 'admin') => {
    const newDir = {
      id: 'dir_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      teamId,
      text,
      sender: senderName,
      senderId
    };
    setDirectives(prev => [newDir, ...prev]);
    
    // Trigger system notification to the recipient
    addSystemNotification(
      `تبليغ جديد من: ${senderName}`,
      text,
      teamId
    );
  };

  const markDirectiveRead = (dirId) => {
    setDirectives(prev => prev.map(d => d.id === dirId ? { ...d, isRead: true } : d));
  };

  // Sync state to Firebase whenever local state changes (after initial load)
  useEffect(() => { if (isMountedEst.current) syncToCloud('establishments', establishments); else isMountedEst.current = true; }, [establishments]);
  useEffect(() => { if (isMountedRep.current) syncToCloud('reports', reports); else isMountedRep.current = true; }, [reports]);
  useEffect(() => { if (isMountedTeam.current) syncToCloud('teams_v2', teams); else isMountedTeam.current = true; }, [teams]);
  useEffect(() => { if (isMountedTrack.current) syncToCloud('trackers_v1', trackers); else isMountedTrack.current = true; }, [trackers]);
  useEffect(() => { if (isMountedClosure.current) syncToCloud('closureVerifications_v1', closureVerifications); else isMountedClosure.current = true; }, [closureVerifications]);
  useEffect(() => { if (isMountedInsp.current) syncToCloud('inspectionTemplates_v3', inspectionTemplates); else isMountedInsp.current = true; }, [inspectionTemplates]);
  useEffect(() => { if (isMountedConf.current) syncToCloud('systemConfig', config); else isMountedConf.current = true; }, [config]);
  useEffect(() => { if (isMountedTick.current) syncToCloud('systemTickets', tickets); else isMountedTick.current = true; }, [tickets]);
  useEffect(() => { if (isMountedNotif.current) syncToCloud('sysNotifs', systemNotifications); else isMountedNotif.current = true; }, [systemNotifications]);
  const isMountedChat = useRef(false);
  useEffect(() => { if (isMountedChat.current) syncToCloud('chatMessages', chatMessages); else isMountedChat.current = true; }, [chatMessages]);
  useEffect(() => { if (isMountedTasks.current) syncToCloud('trackerTasks_v1', tasks); else isMountedTasks.current = true; }, [tasks]);
  useEffect(() => { if (isMountedSos.current) syncToCloud('sosAlerts', sosAlerts); else isMountedSos.current = true; }, [sosAlerts]);
  useEffect(() => { if (isMountedDir.current) syncToCloud('directives', directives); else isMountedDir.current = true; }, [directives]);
  useEffect(() => { if (isMountedDirst.current) syncToCloud('directors', directors); else isMountedDirst.current = true; }, [directors]);
  useEffect(() => { if (isMountedDeliv.current) syncToCloud('deliveries', deliveries); else isMountedDeliv.current = true; }, [deliveries]);
  useEffect(() => { if (isMountedPen.current) syncToCloud('penaltyRequests_v2', penaltyRequests); else isMountedPen.current = true; }, [penaltyRequests]);
  useEffect(() => { if (isMountedDisp.current) syncToCloud('dispatches', dispatches); else isMountedDisp.current = true; }, [dispatches]);

  // Persist new states to Firebase Cloud
  useEffect(() => { if (isMountedAcc.current) syncToCloud('nineveh_accountants', accountants); else isMountedAcc.current = true; }, [accountants]);
  useEffect(() => { if (isMountedFinesBooklet.current) syncToCloud('nineveh_fines_booklet', finesBooklet); else isMountedFinesBooklet.current = true; }, [finesBooklet]);
  useEffect(() => { if (isMountedFineTrans.current) syncToCloud('nineveh_fine_transactions', fineTransactions); else isMountedFineTrans.current = true; }, [fineTransactions]);

  return (
    <AppContext.Provider value={{
      darkMode,
      setDarkMode,
      currentRoute,
      routeParams,
      navigate,
      establishments,
      setEstablishments,
      reports,
      setReports,
      teams,
      setTeams,
      trackers,
      setTrackers,
      closureVerifications,
      setClosureVerifications,
      inspectionTemplates, setInspectionTemplates,
      config,
      setConfig,
      user,
      setUser,
      addEstablishment,
      updateEstablishment,
      deleteEstablishment,
      addInspection,
      addReport,
      deliveries, setDeliveries,
      penaltyRequests, setPenaltyRequests,
      dispatches, setDispatches,
      fines, setFines,
      systemNotifications, setSystemNotifications,
      addSystemNotification,
      chatMessages, setChatMessages, addChatMessage, markChatRead,
      sosAlerts, setSosAlerts,
      triggerSOSAlert,
      directives,
      setDirectives,
      addDirective,
      markDirectiveRead,
      directors,
      setDirectors,
      tickets,
      setTickets,
      addTicket,
      auditLogs,
      logAudit,
      publicCMS,
      setPublicCMS,
      loginCMS,
      setLoginCMS,
      ownerCMS,
      setOwnerCMS,
      globalBroadcast,
      setGlobalBroadcast,
      notification,
      notify,
      playBeep,
      // --- NEW: Smart Tasks ---
      tasks,
      setTasks,
      
      // Settings
      uiPreferences,
      setUiPreferences,
      showDisplayPrefsModal,
      setShowDisplayPrefsModal,
      activityTypes
    , accountants, setAccountants, finesBooklet, setFinesBooklet, fineTransactions, setFineTransactions}}>
      {children}
    </AppContext.Provider>
  );
};
