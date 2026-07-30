const fs = require('fs');
let content = fs.readFileSync('src/components/OperationsRoom.jsx', 'utf8');

// Add states for the closure modal
content = content.replace(
  "const [activeTab, setActiveTab] = useState('trackers_management');",
  "const [activeTab, setActiveTab] = useState('trackers_management');\n  const [closureModalData, setClosureModalData] = useState(null);\n  const [closureDuration, setClosureDuration] = useState('أسبوع واحد');"
);

// Replace handleApproveClosure
const oldApprove = `  const handleApproveClosure = (verification) => {
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

const newApprove = `  const handleApproveClosure = (verification) => {
    if (verification.type === 'reopening') {
      setClosureVerifications(prev => prev.map(v => v.id === verification.id ? { ...v, status: 'approved' } : v));
      setEstablishments(prev => prev.map(e => e.id === verification.estId ? { ...e, status: 'compliant', score: 75, closureDuration: null } : e));
      triggerAlert('تمت المصادقة على إعادة الفتح. المطعم الآن عاد للعمل بتقييم 75%.');
      addSystemNotification(
        'موافقة الإدارة المركزية على إعادة فتح', 
        \`تمت المصادقة على طلب إعادة الفتح لمطعم (\${verification.estName}). المطعم الآن مفتوح.\`, 
        'all'
      );
    } else {
      // Instead of prompt, open custom modal
      setClosureModalData(verification);
    }
  };

  const confirmClosureWithDuration = () => {
    if (!closureModalData) return;
    
    setClosureVerifications(prev => prev.map(v => v.id === closureModalData.id ? { ...v, status: 'approved' } : v));
    setEstablishments(prev => prev.map(e => e.id === closureModalData.estId ? { ...e, status: 'closed', closureDuration: closureDuration, closureDate: new Date().toISOString() } : e));
    
    // Notify Tracker/Field Team
    addSystemNotification(
      'قرار إغلاق نهائي صادر من الإدارة المركزية 🚫', 
      \`المديرية تصادق على غلق مطعم (\${closureModalData.estName}) لمدة (\${closureDuration}). قرار نهائي واجب التنفيذ.\`, 
      'all'
    );
    
    triggerAlert(\`تمت المصادقة على الإغلاق لمدة (\${closureDuration}) بنجاح.\`);
    setClosureModalData(null);
    setClosureDuration('أسبوع واحد');
  };`;

content = content.replace(oldApprove, newApprove);

// Add modal JSX before the closing div of the component
const modalJSX = `
      {/* Closure Duration Modal */}
      {closureModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-rose-500/30 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">مصادقة قرار الإغلاق</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              يرجى تحديد مدة الإغلاق الرسمية لمطعم ({closureModalData.estName}). سيتم إشعار الفرق الميدانية بهذا القرار فوراً.
            </p>
            
            <div className="text-right mb-6">
              <label className="text-[10px] font-bold text-slate-500 block mb-2">مدة الإغلاق المقررة:</label>
              <select 
                value={closureDuration}
                onChange={(e) => setClosureDuration(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-rose-500"
              >
                <option value="3 أيام">3 أيام (إنذار غلق)</option>
                <option value="أسبوع واحد">أسبوع واحد (7 أيام)</option>
                <option value="أسبوعين">أسبوعين (14 يوم)</option>
                <option value="شهر واحد">شهر واحد (30 يوم)</option>
                <option value="مؤقت لحين التصحيح">إغلاق مؤقت (لحين تصحيح المخالفات)</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={confirmClosureWithDuration}
                className="flex-[2] py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-500/20 transition-all cursor-pointer"
              >
                تأكيد الإغلاق وإشعار الميدان
              </button>
              <button 
                onClick={() => setClosureModalData(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

const endOfFileIndex = content.lastIndexOf("    </div>\n  );\n}");
if (endOfFileIndex !== -1) {
  content = content.substring(0, endOfFileIndex) + modalJSX;
} else {
  // Try fallback replacing the very end
  content = content.replace(/    <\/div>\s*  \);\s*\}\s*$/, modalJSX);
}

fs.writeFileSync('src/components/OperationsRoom.jsx', content);
console.log('OperationsRoom updated with custom modal');
