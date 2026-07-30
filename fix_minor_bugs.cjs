const fs = require('fs');

let content = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// 1. Fix uiPreferences undefined crash by adding safe navigation operator
content = content.replace(/uiPreferences\.density/g, '(uiPreferences?.density || "comfortable")');
content = content.replace(/uiPreferences\.headingSize/g, '(uiPreferences?.headingSize || "18px")');
content = content.replace(/uiPreferences\.bodySize/g, '(uiPreferences?.bodySize || "12px")');

// 2. Remove "التقييم" header from establishments table in SuperAdminPanel (line ~1637)
const oldScoreHeader = `<th className="p-3.5 font-bold">التقييم</th>`;
content = content.replace(oldScoreHeader, '');

// 3. Remove "التقييم" data cell from establishments table in SuperAdminPanel
// I need to find exactly how it looks
const scoreRegex = /<td className="p-3\.5">\s*<span className={`px-2 py-0\.5 rounded text-\[10px\] font-black \${[^}]+}`}>\s*\{est\.lastInspection === 'لم يزر بعد' \? 'معلق ⏳' : `\${est\.score}%`\}\s*<\/span>\s*<\/td>/g;
content = content.replace(scoreRegex, '');

// 4. In the Edit Establishment Modal, add the QR code link next to the basic info
// Let's find the edit modal.
const editModalSearch = `<div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">الهاتف</label>
                        <input
                          type="text"
                          value={editingEst.phone}
                          onChange={(e) => setEditingEst({...editingEst, phone: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm text-right focus:outline-none focus:border-teal-500 transition-all dir-ltr"
                          placeholder="رقم الهاتف"
                        />
                      </div>`;
const qrAddition = `\n                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">رابط كود الاستعلام (QR Code)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={window.location.origin + '/qr/' + editingEst.accessCode}
                            readOnly
                            className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-500 text-left dir-ltr"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.origin + '/qr/' + editingEst.accessCode);
                              triggerAlert('تم نسخ رابط الاستعلام بنجاح!');
                            }}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                          >
                            نسخ
                          </button>
                        </div>
                      </div>`;
if (content.includes(editModalSearch) && !content.includes('رابط كود الاستعلام (QR Code)')) {
    content = content.replace(editModalSearch, editModalSearch + qrAddition);
}

// 5. Remove the "QR Code" dedicated modal entirely? The user said "رمز الكيو ار ضيفلياه على هذا الحقل مال تعديل البيانات". I'll just add it to the edit modal, and if they click the QR icon in the table it still works, but I can also remove the QR icon from the table if they don't need it. He said "حقل تعديل البيانات يظهر عندي معلومات اساسية ويظهر عنده حقل ثاني بجانبه رابط الكيوار.. ضيفه هناك افضل". This means I just add the field to the edit modal.

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', content);

// Now do the same for EstablishmentsManager.jsx
let estContent = fs.readFileSync('src/components/EstablishmentsManager.jsx', 'utf8');

// Remove "التقييم" header from EstablishmentsManager
const estScoreHeader = `<th className="p-3.5 font-bold">التقييم</th>`;
estContent = estContent.replace(estScoreHeader, '');

// Remove score cell
estContent = estContent.replace(scoreRegex, '');

// Add QR Link to Edit Modal
if (estContent.includes(editModalSearch) && !estContent.includes('رابط كود الاستعلام (QR Code)')) {
    estContent = estContent.replace(editModalSearch, editModalSearch + qrAddition);
}

fs.writeFileSync('src/components/EstablishmentsManager.jsx', estContent);
console.log('Bugs fixed successfully.');
