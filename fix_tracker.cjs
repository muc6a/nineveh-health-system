const fs = require('fs');
let content = fs.readFileSync('src/pages/TrackerDashboard.jsx', 'utf8');

// 1. Add type to newVerification
content = content.replace(
  "id: `ver_${Date.now()}`,",
  "id: `ver_${Date.now()}`,\n        type: selectedEst?.status === 'closed' ? 'reopening' : 'closure',"
);

// 2. Change modal title
content = content.replace(
  "<h3 className=\"text-sm font-black text-amber-500\">توثيق إغلاق: {selectedEst?.name}</h3>",
  "<h3 className=\"text-sm font-black text-amber-500\">\n                {selectedEst?.status === 'closed' ? 'توثيق طلب فتح:' : 'توثيق إغلاق:'} {selectedEst?.name}\n              </h3>"
);

// 3. Update the card
const oldCard = `              <div key={est.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-rose-200 dark:border-rose-900/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white">{est.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold">المنطقة: {est.neighborhood || est.sector}</p>
                    {est.manualAddress && (
                      <p className="text-[10px] text-slate-400 mt-1.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg leading-relaxed">
                        📍 العنوان الدقيق: {est.manualAddress}
                      </p>
                    )}
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5">التقييم: {est.score}% - مُغلق</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEst(est);
                      startCamera();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20"
                  >
                    <Camera className="w-4 h-4" />
                    التحقق من الإغلاق
                  </button>
                </div>
              </div>`;

const newCard = `              <div key={est.id} className={\`bg-white dark:bg-slate-900 rounded-2xl p-4 border \${est.status === 'closed' ? 'border-amber-200 dark:border-amber-900/30' : 'border-rose-200 dark:border-rose-900/30'} shadow-sm relative overflow-hidden\`}>
                <div className={\`absolute top-0 right-0 w-1.5 h-full \${est.status === 'closed' ? 'bg-amber-500' : 'bg-rose-500'}\`}></div>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-slate-800 dark:text-white">{est.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-bold">المنطقة: {est.neighborhood || est.sector}</p>
                    {est.manualAddress && (
                      <p className="text-[10px] text-slate-400 mt-1.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg leading-relaxed">
                        📍 العنوان الدقيق: {est.manualAddress}
                      </p>
                    )}
                    <p className={\`text-[10px] font-bold mt-1.5 \${est.status === 'closed' ? 'text-amber-500' : 'text-rose-500'}\`}>
                      {est.status === 'closed' ? 'حالة المطعم: مغلق (بانتظار طلب الفتح)' : \`التقييم: \${est.score}% - حرج جداً\`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEst(est);
                      startCamera();
                    }}
                    className={\`flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-md \${est.status === 'closed' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}\`}
                  >
                    <Camera className="w-4 h-4" />
                    {est.status === 'closed' ? 'طلب إعادة فتح' : 'التحقق من الإغلاق'}
                  </button>
                </div>
              </div>`;

content = content.replace(oldCard, newCard);

fs.writeFileSync('src/pages/TrackerDashboard.jsx', content);
console.log('TrackerDashboard fixed');
