const fs = require('fs');
let content = fs.readFileSync('src/pages/PublicSearch.jsx', 'utf8');

const oldBadge = `                    <span className={\`px-2.5 py-1 rounded-xl text-[10px] font-black \${
                      est.lastInspection === 'لم يزر بعد' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                        : est.score >= 90 
                          ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' 
                          : est.score >= 70 
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                            : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }\`}>
                      {est.lastInspection === 'لم يزر بعد' ? 'غير مقيم بعد' : \`\${est.score}% التزام\`}
                    </span>`;

const newBadge = `                    <span className={\`px-2.5 py-1 rounded-xl text-[10px] font-black \${
                      est.lastInspection === 'لم يزر بعد' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' 
                        : est.status === 'closed'
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 border border-rose-600'
                          : est.score >= 90 
                          ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' 
                          : est.score >= 70 
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                            : 'bg-red-500/10 text-red-600 border border-red-500/20'
                    }\`}>
                      {est.lastInspection === 'لم يزر بعد' ? 'غير مقيم بعد' : est.status === 'closed' ? \`🚫 مغلق لمخالفة الشروط (\${est.closureDuration || 'مؤقتاً'})\` : \`\${est.score}% التزام\`}
                    </span>`;

content = content.replace(oldBadge, newBadge);

const oldCardWrap = `<div 
                  key={est.id} 
                  onClick={() => navigate(\`/scan/\${est.id}\`)}
                  className="glassmorphic-card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300 group"
                >`;

const newCardWrap = `<div 
                  key={est.id} 
                  onClick={() => navigate(\`/scan/\${est.id}\`)}
                  className={\`glassmorphic-card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-300 group \${est.status === 'closed' ? 'ring-2 ring-rose-500/50 bg-rose-50/10 dark:bg-rose-950/20' : ''}\`}
                >`;

content = content.replace(oldCardWrap, newCardWrap);

fs.writeFileSync('src/pages/PublicSearch.jsx', content);
console.log('PublicSearch fixed');
