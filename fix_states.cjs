const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

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

// Insert after publicCMS useEffect
content = content.replace(
  "syncToCloud('publicCMS', publicCMS);\n  }, [publicCMS]);",
  "syncToCloud('publicCMS', publicCMS);\n  }, [publicCMS]);" + otherCMSStates
);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log('Fixed states');
