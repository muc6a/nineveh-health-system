const fs = require('fs');

let superAdminContent = fs.readFileSync('src/pages/SuperAdminPanel.jsx', 'utf8');

// Replace "غير مخصص لفريق" block in SuperAdminPanel
const oldTeamDisplay = `<span className="text-[9px] text-teal-600 dark:text-teal-600 dark:text-teal-400 mt-1 font-black">
                                {teams.find(t => t.sector === est.sector) 
                                  ? \`مسؤولية: \${teams.find(t => t.sector === est.sector).name}\`
                                  : '⚠️ غير مخصص لفريق'}
                              </span>`;
const newTeamDisplay = `<span className="text-[9px] text-teal-600 dark:text-teal-600 dark:text-teal-400 mt-1 font-black">
                                القاطع: {est.district || est.sector}
                              </span>`;
superAdminContent = superAdminContent.replace(oldTeamDisplay, newTeamDisplay);

// Remove Score from Establishments Table Header in SuperAdminPanel
const oldScoreHeader = `<th className="p-3.5 w-24">التقييم</th>`;
const newScoreHeader = ``;
superAdminContent = superAdminContent.replace(oldScoreHeader, newScoreHeader);

// Remove Score from Establishments Table Body in SuperAdminPanel
const oldScoreBody = `<td className="p-3.5">
                            <span className={\`px-2 py-0.5 rounded text-[10px] font-black \${
                              est.score >= 90 ? 'bg-emerald-500/10 text-emerald-600' :
                              est.score >= 70 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                            }\`}>
                              {est.lastInspection === 'لم يزر بعد' ? 'معلق ⏳' : \`\${est.score}%\`}
                            </span>
                          </td>`;
const newScoreBody = ``;
superAdminContent = superAdminContent.replace(oldScoreBody, newScoreBody);

fs.writeFileSync('src/pages/SuperAdminPanel.jsx', superAdminContent);


let estManagerContent = fs.readFileSync('src/components/EstablishmentsManager.jsx', 'utf8');

// Replace "غير مخصص لفريق" block in EstablishmentsManager
const oldEstTeamDisplay = `<span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 font-black">
                              {teams.find(t => t.sector === est.sector) 
                                ? \`مسؤولية: \${teams.find(t => t.sector === est.sector).name}\`
                                : '⚠️ غير مخصص لفريق'}
                            </span>`;
const newEstTeamDisplay = `<span className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 font-black">
                              القاطع: {est.district || est.sector}
                            </span>`;
estManagerContent = estManagerContent.replace(oldEstTeamDisplay, newEstTeamDisplay);

// Remove Score from Table Header in EstablishmentsManager
const oldEstScoreHeader = `<th className="text-right p-4 text-xs font-bold text-slate-500">التقييم</th>`;
const newEstScoreHeader = ``;
estManagerContent = estManagerContent.replace(oldEstScoreHeader, newEstScoreHeader);

// Remove Score from Table Body in EstablishmentsManager
const oldEstScoreBody = `<td className="p-4">
                          <span className={\`px-2.5 py-1 rounded-xl text-[10px] font-black \${
                            est.score >= 90 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                            est.score >= 70 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 
                            'bg-red-500/10 text-red-600 border border-red-500/20'
                          }\`}>
                            {est.lastInspection === 'لم يزر بعد' ? 'معلق ⏳' : \`\${est.score}%\`}
                          </span>
                        </td>`;
const newEstScoreBody = ``;
estManagerContent = estManagerContent.replace(oldEstScoreBody, newEstScoreBody);

fs.writeFileSync('src/components/EstablishmentsManager.jsx', estManagerContent);

console.log('Establishments logic updated.');
