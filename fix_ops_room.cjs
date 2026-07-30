const fs = require('fs');
let content = fs.readFileSync('src/components/OperationsRoom.jsx', 'utf8');

const oldApprove = `  const handleApproveClosure = (verification) => {
    setClosureVerifications(prev => prev.map(v => v.id === verification.id ? { ...v, status: 'approved' } : v));
    setEstablishments(prev => prev.map(e => e.id === verification.estId ? { ...e, status: 'closed' } : e));
    triggerAlert('تمت المصادقة على الإغلاق وتحديث حالة المطعم إلى مغلق بنجاح.');
  };`;

const newApprove = `  const handleApproveClosure = (verification) => {
    if (verification.type === 'reopening') {
      setClosureVerifications(prev => prev.map(v => v.id === verification.id ? { ...v, status: 'approved' } : v));
      setEstablishments(prev => prev.map(e => e.id === verification.estId ? { ...e, status: 'compliant', score: 75, closureDuration: null } : e));
      triggerAlert('تمت المصادقة على إعادة الفتح. المطعم الآن عاد للعمل بتقييم 75%.');
    } else {
      const duration = window.prompt('يرجى تحديد مدة الإغلاق (مثال: أسبوع، أسبوعين، 10 أيام):', 'أسبوع');
      if (duration === null) return; // User cancelled
      setClosureVerifications(prev => prev.map(v => v.id === verification.id ? { ...v, status: 'approved' } : v));
      setEstablishments(prev => prev.map(e => e.id === verification.estId ? { ...e, status: 'closed', closureDuration: duration, closureDate: new Date().toISOString() } : e));
      triggerAlert(\`تمت المصادقة على الإغلاق لمدة (\${duration}) وتحديث حالة المطعم إلى مغلق بنجاح.\`);
    }
  };`;

content = content.replace(oldApprove, newApprove);

const oldCardType = `<h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-400">{ver.estName}</h4>`;
const newCardType = `<h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-400">
                        {ver.type === 'reopening' ? '🔓 طلب إعادة فتح:' : '🔒 توثيق إغلاق:'} {ver.estName}
                      </h4>`;
content = content.replace(oldCardType, newCardType);

const oldApproveBtn = `<button 
                        onClick={() => handleApproveClosure(ver)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> مصادقة الإغلاق
                      </button>`;
const newApproveBtn = `<button 
                        onClick={() => handleApproveClosure(ver)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> {ver.type === 'reopening' ? 'مصادقة الفتح' : 'مصادقة الإغلاق'}
                      </button>`;
content = content.replace(oldApproveBtn, newApproveBtn);

fs.writeFileSync('src/components/OperationsRoom.jsx', content);
console.log('OperationsRoom fixed');
