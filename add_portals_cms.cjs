const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// 1. Firebase Sync Injection
const firebaseSyncSearch = `setupFirebaseSync('publicCMS', setPublicCMS, publicCMS);`;
const firebaseSyncReplace = `setupFirebaseSync('publicCMS', setPublicCMS, publicCMS);
      setupFirebaseSync('loginCMS', setLoginCMS, loginCMS);
      setupFirebaseSync('ownerCMS', setOwnerCMS, ownerCMS);`;
content = content.replace(firebaseSyncSearch, firebaseSyncReplace);

// 2. States Injection
const statesSearch = `// Public Search Page CMS
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
  }, [publicCMS]);`;

const statesReplace = statesSearch + `\n
  // Login Gate CMS
  const [loginCMS, setLoginCMS] = useState(() => {
    const saved = localStorage.getItem('loginCMS');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'منظومة الرقابة الصحية الرقمية',
      heroSubtext: 'مديرية صحة نينوى - قسم الرقابة الصحية',
      announcement: ''
    };
  });

  useEffect(() => {
    syncToCloud('loginCMS', loginCMS);
  }, [loginCMS]);

  // Owner Portal CMS
  const [ownerCMS, setOwnerCMS] = useState(() => {
    const saved = localStorage.getItem('ownerCMS');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'بوابة أصحاب المنشآت',
      heroSubtext: 'تتيح لك هذه البوابة متابعة التقييمات الصحية، تقديم اعتراضات، واستخراج الشهادات والتصاريح الخاصة بمنشأتك.',
      announcement: ''
    };
  });

  useEffect(() => {
    syncToCloud('ownerCMS', ownerCMS);
  }, [ownerCMS]);`;

content = content.replace(statesSearch, statesReplace);

// 3. Export Injection
const exportSearch = `      publicCMS,
      setPublicCMS,`;
const exportReplace = `      publicCMS,
      setPublicCMS,
      loginCMS,
      setLoginCMS,
      ownerCMS,
      setOwnerCMS,`;
content = content.replace(exportSearch, exportReplace);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('AppContext updated with Portals CMS.');
