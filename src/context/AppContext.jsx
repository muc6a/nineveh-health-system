import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const INITIAL_ESTABLISHMENTS = [
  {
    id: 'est_new_1',
    name: 'مطعم لاماسو (Lamassu Restaurant)',
    type: '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
    owner: 'شركة لاماسو للخدمات السياحية',
    phone: '07700001111',
    accessCode: 'LAMA-99',
    licenseNumber: 'LIC-2026-N90',
    propertyNumber: '2م/2167/44',
    sector: 'الجانب الأيسر - المجموعة الثقافية',
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
    type: '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
    owner: 'إدارة شاورما لاند',
    phone: '07501112233',
    accessCode: 'SHAW-88',
    licenseNumber: 'LIC-2026-Z10',
    propertyNumber: '3أ/9082/11',
    sector: 'الجانب الأيسر - حي الزهور',
    lastInspection: '2026-07-02',
    score: 0,
    status: 'closed',
    facebook: 'https://instagram.com/shawarma_land_iq',
    latitude: '36.3712',
    longitude: '43.1610',
    history: [
      { date: '2026-07-02', score: 91, notes: 'المطبخ والتهوية جيدة، والشهادات الصحية للعاملين سارية المفعول.' }
    ]
  },
  {
    id: 'est_new_3',
    name: 'مطاعم الجندول',
    type: '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
    owner: 'إدارة مطاعم الجندول',
    phone: '07718882233',
    accessCode: 'JAND-77',
    licenseNumber: 'LIC-2026-C44',
    propertyNumber: '12ب/4431/09',
    sector: 'الجانب الأيسر - حي المهندسين',
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
    type: '🪒 صالون حلاقة وتجميل',
    owner: 'سحر عبد الرحمن',
    phone: '07705554433',
    accessCode: 'SAHR-66',
    licenseNumber: 'LIC-2026-B88',
    propertyNumber: '4ج/7721/01',
    sector: 'الجانب الأيسر - حي النور',
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
    type: '🍽️ إعداد وتحضير وتقديم الأطعمة والمشروبات',
    owner: 'أبو رائد الحيالي',
    phone: '07702223344',
    accessCode: 'RAED-55',
    licenseNumber: 'LIC-2026-M11',
    propertyNumber: '11أ/1122/04',
    sector: 'الجانب الأيمن - الموصل القديمة',
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
    type: '🪒 صالون حلاقة وتجميل',
    owner: 'محمد سالم',
    phone: '07709998877',
    licenseNumber: 'LIC-2026-H22',
    propertyNumber: '5م/8877/02',
    sector: 'الجانب الأيسر - حي الجامعة',
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
    sector: 'الجانب الأيسر - الكرامة',
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
    type: '☕ مقهى وكافيه',
    owner: 'عمر هاشم',
    phone: '07718889900',
    licenseNumber: 'LIC-2026-C88',
    propertyNumber: '7أ/5543/08',
    sector: 'الجانب الأيسر - الغابات',
    lastInspection: 'لم يزر بعد',
    score: 100,
    status: 'compliant',
    facebook: 'https://instagram.com/albustan_cafe',
    latitude: '36.3900',
    longitude: '43.1200',
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
    establishmentName: 'مطعم وتكة فالح أبو العمبة',
    sector: 'الغزلاني',
    details: 'المطعم مزدحم جداً ولا توجد تهوية كافية مما يسبب ضيق تنفس للزبائن.',
    evidenceImage: null,
    isDelivery: false,
    status: 'investigated'
  }
];
const DEFAULT_PERMISSIONS = {
  manageEstablishments: true,
  createEst: false,
  editEst: false,
  deleteEst: false,
  addEval: true,
  showMainDashboard: true,
  showReportsPage: true,
  showDirectivesPage: true,
  showDeliveryPage: false,
  showPublicEvalsPage: true,
  sendDirective: false,
  replyDirective: true
};

const INITIAL_TEAMS = [
  { 
    id: 'team_left', 
    name: 'اللجنة الرقابية لمركز المحافظة - الجانب الأيسر', 
    sector: 'الجانب الأيسر', 
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
    sector: 'الجانب الأيمن', 
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
    sector: 'تلعفر', 
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

const DEFAULT_INSPECTION_ITEMS = [
  // Section A (20 points total)
  { id: 1, section: 'A', text: 'حمل العمال لبطاقات الفحص الطبي والشهادات الصحية السارية.', points: 5 },
  { id: 2, section: 'A', text: 'ارتداء غطاء الرأس والكمامات والمآزر والنظافة الشخصية الكاملة للعمال.', points: 5 },
  { id: 3, section: 'A', text: 'منع التدخين كلياً داخل صالات التحضير والطهي وتوفير لافتات إرشادية.', points: 5 },
  { id: 4, section: 'A', text: 'خلو أيدي العاملين من الجروح المفتوحة وارتداء القفازات الصحية المناسبة.', points: 5 },
  // Section B (20 points total)
  { id: 5, section: 'B', text: 'سلامة ونظافة الأرضيات والجدران والأسقف وخلوها من التشققات.', points: 5 },
  { id: 6, section: 'B', text: 'تثبيت مصافي شبكية سلكية ضيقة على النوافذ لمنع الحشرات وسلامة التهوية.', points: 5 },
  { id: 7, section: 'B', text: 'توفير سلات مهملات محكمة الإغلاق وتفتح بالقدم ومزودة بأكياس بلاستيكية.', points: 5 },
  { id: 8, section: 'B', text: 'تفعيل مصائد الحشرات الكهربائية وجهاز مكافحة القوارض بشكل مستمر.', points: 5 },
  // Section C (25 points total)
  { id: 9, section: 'C', text: 'مراقبة تاريخ الصلاحية للمواد الغذائية الخام والتخزين الآمن.', points: 5 },
  { id: 10, section: 'C', text: 'حفظ المواد الجافة على رفوف خشبية أو معدنية مرتفعة عن الأرض.', points: 5 },
  { id: 11, section: 'C', text: 'الفصل التام بين الأطعمة النيئة والمطبوخة داخل الثلاجات والمجمدات.', points: 5 },
  { id: 12, section: 'C', text: 'استخدام مصادر مياه صالحة ومعقمة للشرب وغسل المواد الغذائية وصناعة الثلج.', points: 5 },
  { id: 13, section: 'C', text: 'سلامة ونظافة أحواض غسيل اللحوم والخضار وتوفر المعقمات.', points: 5 },
  // Section D (20 points total)
  { id: 14, section: 'D', text: 'تنظيف وتعقيم الأواني والمعدات المصنوعة من الستانلس ستيل المقاوم للصدأ.', points: 5 },
  { id: 15, section: 'D', text: 'الفصل التام بين لوحات وسكاكين تقطيع اللحوم الحمراء عن الخضار والدواجن.', points: 5 },
  { id: 16, section: 'D', text: 'كفاية الإنارة داخل المطبخ وصالة تقديم الطعام والتهوية الصحية.', points: 5 },
  { id: 17, section: 'D', text: 'توفير مطافئ حريق صالحة للاستخدام وصندوق إسعافات أولية مجهز.', points: 5 },
  // Section E (15 points total)
  { id: 18, section: 'E', text: 'وجود إجازة صحية رسمية نافذة وإشعار مالك المحل قبل شهر من الانتهاء.', points: 5 },
  { id: 19, section: 'E', text: 'تنفيذ الملاحظات والمخالفات المسجلة في زيارة لجنة الرقابة السابقة.', points: 5 },
  { id: 20, section: 'E', text: 'وجود السجل الصحي المعتمد لتوثيق الزيارات وتوقيع المفتشين ورئيس اللجنة.', points: 5 }
];

const INITIAL_DELIVERIES = [];

export const AppProvider = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [currentRoute, setCurrentRoute] = useState(() => {
    return localStorage.getItem('currentRoute') || '/login';
  });

  useEffect(() => {
    localStorage.setItem('currentRoute', currentRoute);
  }, [currentRoute]);

  const [routeParams, setRouteParams] = useState({});

  // Core Databases
  const [establishments, setEstablishments] = useState(() => {
    const saved = localStorage.getItem('establishments');
    const parsed = saved ? JSON.parse(saved) : [];
    
    // Merge new initial establishments if they don't exist in local storage yet
    const existingIds = new Set(parsed.map(e => e.id));
    INITIAL_ESTABLISHMENTS.forEach(initialEst => {
      if (!existingIds.has(initialEst.id)) {
        parsed.push(initialEst);
      }
    });

    return parsed.map(est => ({
      ...est,
      accessCode: est.accessCode || Math.random().toString(36).substring(2, 8).toUpperCase()
    }));
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams_v2');
    const parsed = saved ? JSON.parse(saved) : null;
    return parsed && parsed.length > 0 ? parsed : INITIAL_TEAMS;
  });

  useEffect(() => {
    syncToCloud('teams_v2', teams);
  }, [teams]);

  const [trackers, setTrackers] = useState(() => {
    const saved = localStorage.getItem('trackers_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    syncToCloud('trackers_v1', trackers);
  }, [trackers]);

  const [closureVerifications, setClosureVerifications] = useState(() => {
    const saved = localStorage.getItem('closureVerifications_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    syncToCloud('closureVerifications_v1', closureVerifications);
  }, [closureVerifications]);

  const [inspectionItems, setInspectionItems] = useState(() => {
    const saved = localStorage.getItem('inspectionItems');
    return saved ? JSON.parse(saved) : DEFAULT_INSPECTION_ITEMS;
  });

  // Super Admin Configuration parameters
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('systemConfig');
    return saved ? JSON.parse(saved) : {
      headerText: 'منظومة الرقابة الصحية الرقمية - محافظة نينوى',
      allowImageUpload: true,
      allowExternalReports: true,
      imageRetention: '6 Months',
      reportRetentionDays: 30,
      uiScale: 'normal', // small, normal, large
      brandingVideo: '/logo-animated.mp4',
      passingScore: 90,
      warningScore: 70,
      maintenanceMode: false
    };
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('auditLogs');
    return saved ? JSON.parse(saved) : [];
  });

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
    import('../firebase.js').then(({ db }) => {
      import('firebase/database').then(({ ref, onValue, set }) => {
        
        const setupFirebaseSync = (key, setter, localFallback) => {
          const dbRef = ref(db, 'prototype_state/' + key);
          
          // Listen for changes from Firebase
          onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setter(data);
              localStorage.setItem(key, JSON.stringify(data));
            } else if (localFallback) {
              // If Firebase is empty but we have local fallback, initialize Firebase
              set(dbRef, localFallback);
            }
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
        setupFirebaseSync('inspectionItems', setInspectionItems, inspectionItems);
        setupFirebaseSync('systemConfig', setConfig, config);
        setupFirebaseSync('auditLogs', setAuditLogs, auditLogs);
        setupFirebaseSync('globalBroadcast', setGlobalBroadcast, globalBroadcast);
        setupFirebaseSync('systemTickets', setTickets, tickets);
        setupFirebaseSync('sysNotifs', setSystemNotifications, systemNotifications);
        setupFirebaseSync('publicCMS', setPublicCMS, publicCMS);
        setupFirebaseSync('directives', setDirectives, directives);
        setupFirebaseSync('directors', setDirectors, directors);
      });
    }).catch(err => console.error("Firebase load error", err));
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
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [penaltyRequests, setPenaltyRequests] = useState([]);
  const [dispatches, setDispatches] = useState([]);

  // Global Notification System
  const [notification, setNotification] = useState({ message: '', type: 'info', id: 0 });

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
      const { db } = await import('../firebase.js');
      const { ref, set } = await import('firebase/database');
      const dbRef = ref(db, 'prototype_state/' + key);
      await set(dbRef, data);
    } catch (err) {
      console.error('Firebase Write Error:', err);
      if (key === 'teams_v2') {
        notify('خطأ في الاتصال بقاعدة البيانات! يرجى التأكد من تفعيل Realtime Database في وضع الاختبار.', 'error');
      }
    }
  };

  // Sync state to Firebase whenever local state changes
  useEffect(() => { syncToCloud('establishments', establishments); }, [establishments]);
  useEffect(() => { syncToCloud('reports', reports); }, [reports]);
  useEffect(() => { syncToCloud('teams_v2', teams); }, [teams]);
  useEffect(() => { syncToCloud('trackers_v1', trackers); }, [trackers]);
  useEffect(() => { syncToCloud('closureVerifications_v1', closureVerifications); }, [closureVerifications]);
  useEffect(() => { syncToCloud('inspectionItems', inspectionItems); }, [inspectionItems]);
  useEffect(() => { syncToCloud('systemConfig', config); }, [config]);
  useEffect(() => { syncToCloud('systemTickets', tickets); }, [tickets]);
  useEffect(() => { syncToCloud('sysNotifs', systemNotifications); }, [systemNotifications]);
  useEffect(() => { syncToCloud('directives', directives); }, [directives]);
  useEffect(() => { syncToCloud('directors', directors); }, [directors]);


  // Public Search Page CMS
  const [publicCMS, setPublicCMS] = useState(() => {
    const saved = localStorage.getItem('publicCMS');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'ابحث عن مطاعم ومقاهي نينوى',
      heroSubtext: 'استعلم عن التقييم الصحي ومدى التزام المنشآت الغذائية بالشروط الصحية قبل الشراء، أو قدم شكوى مباشرة لفرق التفتيش.',
      announcement: ''
    };
  });

  useEffect(() => {
    syncToCloud('publicCMS', publicCMS);
  }, [publicCMS]);

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
    if (window.location.pathname && window.location.pathname !== '/') {
      navigate(initialPath);
    } else {
      navigate('/login');
    }
    
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

  const addInspection = (establishmentId, score, notes, selectedRatings, inspectorName, coords, isEdit = false, teamId = null) => {
    const status = score >= 90 ? 'compliant' : score >= 70 ? 'monitoring' : 'non_compliant';
    const date = new Date().toISOString().split('T')[0];
    
    let targetEstName = '';

    setEstablishments(prev => prev.map(est => {
      if (est.id === establishmentId) {
        targetEstName = est.name;
        let updatedHistory = [...(est.history || [])];
        const newEntry = { date, score, notes, inspectorName, ratings: selectedRatings };
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

  useEffect(() => {
    syncToCloud('directives', directives);
  }, [directives]);

  const [directors, setDirectors] = useState(() => {
    const saved = localStorage.getItem('directors');
    return saved ? JSON.parse(saved) : [
      { id: 'dir_acc_1', name: 'د. عماد محمد عبد الله', role: 'director', title: 'مدير عام صحة نينوى', email: 'director@ninveh.health.gov.iq', phone: '07700000000', username: 'emad_dg', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS } },
      { id: 'dir_acc_2', name: 'أ. جاسم محمد الجبوري', role: 'committee_director', title: 'مدير قسم الصحة العامة', email: 'jassim@ninveh.health.gov.iq', phone: '07711223344', username: 'jassim_ph', password: 'password123', active: true, permissions: { ...DEFAULT_PERMISSIONS } }
    ];
  });

  useEffect(() => {
    syncToCloud('directors', directors);
  }, [directors]);

  const addDirective = (teamId, text, senderName = 'مدير الصحة') => {
    const newDir = {
      id: 'dir_' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      teamId,
      text,
      sender: senderName
    };
    setDirectives(prev => [newDir, ...prev]);
  };

  const markDirectiveRead = (dirId) => {
    setDirectives(prev => prev.map(d => d.id === dirId ? { ...d, isRead: true } : d));
  };

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
      inspectionItems,
      setInspectionItems,
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
      systemNotifications, setSystemNotifications,
      addSystemNotification,
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
      globalBroadcast,
      setGlobalBroadcast,
      notification,
      notify
    }}>
      {children}
    </AppContext.Provider>
  );
};
