const NINEVEH_GEOGRAPHY = {
  districts: [
    { id: 'hamdaniya', label: 'قضاء الحمدانية' },
    { id: 'talafar', label: 'قضاء تلعفر' }
  ]
};
const parseSector = (sector) => {
    let parsedMain = 'mosul_right';
    let parsedSub = '';
    if (!sector) return { parsedMain, parsedSub };
    if (sector.includes('الجانب الأيمن')) {
      parsedMain = 'mosul_right';
    } else if (sector.includes('الجانب الأيسر')) {
      parsedMain = 'mosul_left';
    } else {
      NINEVEH_GEOGRAPHY.districts.forEach(d => {
        if (sector.includes(d.label.replace('قضاء ', '')) || d.label.includes(sector.replace('قضاء ', ''))) {
          parsedMain = d.id;
        }
      });
    }
    return { parsedMain, parsedSub };
};
console.log(parseSector('تلعفر'));
console.log(parseSector('قاطع تلعفر'));
