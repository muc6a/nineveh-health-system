const fs = require('fs');
const content = fs.readFileSync('src/components/OperationsRoom.jsx', 'utf8');

let newContent = content.replace(
  "import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send } from 'lucide-react';",
  "import { AlertCircle, Target, ShieldCheck, Users, Info, Edit, Trash2, Mail, Send, Camera, CheckCircle, XCircle } from 'lucide-react';"
);

newContent = newContent.replace(
  "const { establishments, teams, setTeams, trackers, setTrackers, reports, setReports, penaltyRequests, setPenaltyRequests, dispatches, setDispatches, addSystemNotification, notify } = useContext(AppContext);",
  "const { establishments, setEstablishments, teams, setTeams, trackers, setTrackers, reports, setReports, penaltyRequests, setPenaltyRequests, dispatches, setDispatches, closureVerifications, setClosureVerifications, addSystemNotification, notify } = useContext(AppContext);"
);

newContent = newContent.replace(
  "  // States for Dispatch",
  `  const handleApproveClosure = (verification) => {
    setClosureVerifications(prev => prev.map(v => v.id === verification.id ? { ...v, status: 'approved' } : v));
    setEstablishments(prev => prev.map(e => e.id === verification.estId ? { ...e, status: 'closed' } : e));
    triggerAlert('تمت المصادقة على الإغلاق وتحديث حالة المطعم إلى مغلق بنجاح.');
  };

  const handleRejectClosure = (verificationId) => {
    setClosureVerifications(prev => prev.map(v => v.id === verificationId ? { ...v, status: 'rejected' } : v));
    triggerAlert('تم رفض الدليل وإعادته للمتابعة.');
  };

  // States for Dispatch`
);

const tabHeaderStr = `        <button
          onClick={() => setActiveTab('monthly_stats')}
          className={\`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 \${
            activeTab === 'monthly_stats' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }\`}
        >
          <Target className="w-4 h-4" />
          إحصائيات الإغلاق والغرامات
        </button>
      </div>`;

const newTabHeaderStr = `        <button
          onClick={() => setActiveTab('monthly_stats')}
          className={\`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 \${
            activeTab === 'monthly_stats' ? 'border-b-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }\`}
        >
          <Target className="w-4 h-4" />
          إحصائيات الإغلاق والغرامات
        </button>
        <button
          onClick={() => setActiveTab('closure_verifications')}
          className={\`pb-2 text-xs font-black transition-all cursor-pointer flex items-center gap-2 \${
            activeTab === 'closure_verifications' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }\`}
        >
          <Camera className="w-4 h-4" />
          أدلة الإغلاق (الميدانية)
        </button>
      </div>`;

newContent = newContent.replace(tabHeaderStr, newTabHeaderStr);


const closureTabPanelStr = `      {activeTab === 'closure_verifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">أدلة الإغلاق الميدانية الواردة من فرق المتابعة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {closureVerifications && closureVerifications.length > 0 ? (
              closureVerifications.map(ver => (
                <div key={ver.id} className="glassmorphic-card p-4 border border-indigo-500/20 relative">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-400">{ver.estName}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">المرسل: {ver.trackerName}</p>
                      <p className="text-[10px] text-slate-500">{new Date(ver.date).toLocaleString('ar-IQ')}</p>
                    </div>
                    {ver.status === 'pending' ? (
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold">قيد المراجعة</span>
                    ) : ver.status === 'approved' ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-full font-bold">مصادق عليه</span>
                    ) : (
                      <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-1 rounded-full font-bold">مرفوض</span>
                    )}
                  </div>
                  
                  {ver.photo && (
                    <div className="mt-2 mb-3 bg-slate-900 rounded-xl overflow-hidden flex justify-center items-center border border-slate-700 h-48 relative group">
                      <img src={ver.photo} alt="دليل إغلاق" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}

                  {ver.notes && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">ملاحظات فريق المتابعة:</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{ver.notes}</p>
                    </div>
                  )}

                  {ver.status === 'pending' && (
                    <div className="flex gap-2 mt-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                      <button 
                        onClick={() => handleApproveClosure(ver)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" /> مصادقة الإغلاق
                      </button>
                      <button 
                        onClick={() => handleRejectClosure(ver.id)}
                        className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 p-2 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 font-bold text-sm">لا توجد أدلة إغلاق واردة حالياً</p>
              </div>
            )}
          </div>
        </div>
      )}
`;

const endOfFileIndex = newContent.indexOf("    </div>\n  );\n}");
if (endOfFileIndex !== -1) {
  newContent = newContent.substring(0, endOfFileIndex) + closureTabPanelStr + "\n" + newContent.substring(endOfFileIndex);
}

fs.writeFileSync('src/components/OperationsRoom.jsx', newContent);
console.log('Done modifying OperationsRoom');
