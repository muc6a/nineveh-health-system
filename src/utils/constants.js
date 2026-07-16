export const ROLES_DICTIONARY = [
  { id: 'director_general', label: 'مدير عام دائرة صحة نينوى', category: 'الإدارة العليا' },
  { id: 'deputy_director_general', label: 'معاون المدير العام للشؤون الفنية', category: 'الإدارة العليا' },
  { id: 'central_director', label: 'مدير الرقابة المركزية', category: 'الإدارة الوسطى' },
  { id: 'deputy_public_health_director', label: 'معاون مدير القسم', category: 'الإدارة الوسطى' },
  { id: 'central_health_sector_director', label: 'مدير شعبة الرقابة الصحية المركزية', category: 'الإدارة الوسطى' },
  { id: 'right_bank_sector_director', label: 'مدير شعبة الرقابة الصحية : جانب الايمن', category: 'الإدارة الميدانية' },
  { id: 'left_bank_sector_director', label: 'مدير شعبة الرقابة الصحية : جانب الايسر', category: 'الإدارة الميدانية' },
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
        label: 'الجانب الأيمن',
        neighborhoods: [
          'الموصل القديمة', 'باب البيض', 'باب الطوب', 'الميدان', 'رأس الكور', 'الشفاء', 
          'الفاروق', 'الدواسة', 'النبي شيت', 'الطيران', 'الجوسق', 'اليرموك', 'وادي حجر', 
          'مشيرفة', 'تموز', 'الإصلاح الزراعي', 'العريبي'
        ]
      },
      left: {
        label: 'الجانب الأيسر',
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
