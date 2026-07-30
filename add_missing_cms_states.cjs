const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// 1. Add states
const publicCMSState = `  const [publicCMS, setPublicCMS] = useState(() => {
    const saved = localStorage.getItem('publicCMS');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'البحث والتقصي عن المنشآت الصحية والتجارية في نينوى',
      heroSubtext: 'استعلم عن التقييم الصحي ومدى التزام المنشآت الغذائية بالشروط الصحية قبل الشراء، أو قدم شكوى مباشرة لفرق التفتيش.',
    };
  });

  useEffect(() => {
    syncToCloud('publicCMS', publicCMS);
  }, [publicCMS]);`;

const otherCMSStates = `

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
`;

if (!content.includes('const [loginCMS, setLoginCMS]')) {
    content = content.replace(publicCMSState, publicCMSState + otherCMSStates);
}

// 2. Add to Provider value
const providerStart = `      publicCMS,
      setPublicCMS,`;

const providerNew = `      publicCMS,
      setPublicCMS,
      loginCMS,
      setLoginCMS,
      ownerCMS,
      setOwnerCMS,`;

if (!content.includes('loginCMS,')) {
    content = content.replace(providerStart, providerNew);
}

// 3. Add to Firebase sync (around line 522)
const fbSyncStart = `      setupFirebaseSync('publicCMS', setPublicCMS, publicCMS);`;
const fbSyncNew = `      setupFirebaseSync('publicCMS', setPublicCMS, publicCMS);
      setupFirebaseSync('loginCMS', setLoginCMS, loginCMS);
      setupFirebaseSync('ownerCMS', setOwnerCMS, ownerCMS);`;

if (!content.includes("setupFirebaseSync('loginCMS'")) {
    content = content.replace(fbSyncStart, fbSyncNew);
}

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('Added CMS states to AppContext.');
